import Order from "../models/Order.js";
import Meal from "../models/Meal.js";
import { StatusCodes } from "http-status-codes";
import { checkPermissions } from "../utils/checkPermissions.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import mongoose from "mongoose";
import Stripe from "stripe";
import dotenv from "dotenv";
import moment from "moment";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);

const createOrder = async (req, res) => {
	const { items: cartItems, deliveryFee, tax, deliveryAddress } = req.body; //check if an alias is needed

	if (!cartItems || cartItems.length < 1) {
		throw new BadRequestError("No cart items provided");
	}
	if (!deliveryFee || !tax || !deliveryAddress) {
		throw new BadRequestError(
			"Please provide tax, delivery fee and delivery address."
		);
	}

	let orderItems = [];
	let subtotal = 0;

	for (const item of cartItems) {
		if (mongoose.Types.ObjectId.isValid(item.id)) {
			const dbMeal = await Meal.findOne({
				_id: item.id,
			});

			const { _id, name, price, image } = dbMeal;
			const singleOrderItem = {
				name,
				price,
				image,
				amount: item.amount,
				id: _id, //mealID
			};
			// add item to order
			orderItems = [...orderItems, singleOrderItem];
			//calculate subtotal
			subtotal += item.amount * price;
		} else {
			throw new NotFoundError(`No meal with id: ${item.id}`);
		}
	}
	// calculate total
	const total = tax + deliveryFee + subtotal;
	// get stripe client secret
	const paymentIntent = await stripe.paymentIntents.create({
		amount: total,
		currency: "eur",
		automatic_payment_methods: {
			enabled: true,
		},
	});

	const order = await Order.create({
		orderItems,
		total,
		subtotal,
		tax,
		deliveryFee,
		clientSecret: paymentIntent.client_secret,
		user: req.user.userId,
		deliveryAddress,
	});
	res.status(StatusCodes.CREATED).json({
		order,
		clientSecret: order.client_secret,
	});
};

const updateOrder = async (req, res) => {
	const { id: orderId } = req.params;

	const order = await Order.findOne({ _id: orderId });
	if (!order) {
		throw new NotFoundError(`No order with id: ${orderId}`);
	}
	// checkPermissions(req.user, order.user); /// checking later
	const updatedOrder = await Order.findByIdAndUpdate(
		{ _id: orderId },
		req.body,
		{ new: true, runValidators: true }
	);

	res.status(StatusCodes.OK).json({ updatedOrder });
};

const getAllOrders = async (req, res) => {
	const orders = await Order.find({});
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
	const { id: orderId } = req.params;

	if (mongoose.Types.ObjectId.isValid(orderId)) {
		const order = await Order.findOne({ _id: orderId });
		checkPermissions(req.user, order.user); /// checking later
		res.status(StatusCodes.OK).json({ order });
	} else {
		throw new NotFoundError(`No order with id: ${orderId}`);
	}
};

const getCurrentUserOrders = async (req, res) => {
	const orders = await Order.find({ user: req.user.userId });
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const deleteOrder = async (req, res) => {
	const { id: orderId } = req.params;

	const order = await Order.findOne({ _id: orderId });

	if (!order) {
		throw new NotFoundError(`No order with id: ${orderId}`);
	}

	//check permissions
	await order.remove();

	res.status(StatusCodes.OK).json({ msg: "Success! Order removed" });
};

const showAllStats = async (req, res) => {
	let stats = await Order.aggregate([
		//match is for the specific user
		// { $match: { user: mongoose.Types.ObjectId(req.user.userId) } },
		{ $group: { _id: "$status", count: { $sum: 1 } } },
	]);
	stats = stats.reduce((acc, curr) => {
		const { _id: title, count } = curr;
		acc[title] = count;
		return acc;
	}, {});

	const defaultStats = {
		paid: stats.paid || 0,
		sent: stats.sent || 0,
		canceled: stats.canceled || 0,
		delivered: stats.delivered || 0,
	};

	let monthlyOrders = await Order.aggregate([
		//match is for the specific user
		// { $match: { user: mongoose.Types.ObjectId(req.user.userId) } },
		{
			$group: {
				_id: {
					year: { $year: "$createdAt" },
					month: { $month: "$createdAt" },
				},
				count: { $sum: 1 },
			},
		},
		{ $sort: { "_id.year": -1, "_id.month": -1 } },
		{ $limit: 6 },
	]);

	monthlyOrders = monthlyOrders
		.map((item) => {
			const {
				_id: { year, month },
				count,
			} = item;
			const date = moment()
				.month(month - 1)
				.year(year)
				.format("MMM Y");

			return { date, count };
		})
		.reverse();

	res.status(StatusCodes.OK).json({ defaultStats, monthlyOrders });
};

const showMyStats = async (req, res) => {
	let myMonthlyOrders = await Order.aggregate([
		{ $match: { user: mongoose.Types.ObjectId(req.user.userId) } },
		{
			$group: {
				_id: {
					year: { $year: "$createdAt" },
					month: { $month: "$createdAt" },
				},
				count: { $sum: 1 },
			},
		},
		{ $sort: { "_id.year": -1, "_id.month": -1 } },
		{ $limit: 6 },
	]);

	myMonthlyOrders = myMonthlyOrders
		.map((item) => {
			const {
				_id: { year, month },
				count,
			} = item;
			const date = moment()
				.month(month - 1)
				.year(year)
				.format("MMM Y");

			return { date, count };
		})
		.reverse();

	res.status(StatusCodes.OK).json({ myMonthlyOrders });
};

export {
	createOrder,
	updateOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	deleteOrder,
	showAllStats,
	showMyStats,
};

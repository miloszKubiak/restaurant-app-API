import Order from "../models/Order.js";
import Meal from "../models/Meal.js";
import { StatusCodes } from "http-status-codes";
import { checkPermissions } from "../utils/checkPermissions.js";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import mongoose from "mongoose";

// fake api for test
const fakeStripeAPI = async ({ amount, currency }) => {
	const client_secret = "bazinga";
	return { client_secret, amount };
};

const createOrder = async (req, res) => {
	const { items: cartItems, deliveryFee, tax } = req.body; //check if an alias is needed

	if (!cartItems || cartItems.length < 1) {
		throw new BadRequestError("No cart items provided");
	}
	if (!deliveryFee || !tax) {
		throw new BadRequestError("Please provide tax and delifery fee");
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
				id: _id,
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
	const paymentIntent = await fakeStripeAPI({
		amount: total,
		currency: "eur",
	});

	const order = await Order.create({
		orderItems,
		total,
		subtotal,
		tax,
		deliveryFee,
		clientSecret: paymentIntent.client_secret,
		user: req.user.userId,
	});

	res.status(StatusCodes.CREATED).json({
		order,
		clientSecret: order.client_secret,
	});
};

const updateOrder = async (req, res) => {
	const { id: orderId } = req.params;
	const { paymentIntentId } = req.body;

	const order = await Order.findOne({ _id: orderId });
	if (!order) {
		throw new NotFoundError(`No order with id: ${orderId}`);
	}
	checkPermissions(req.user, order.user); /// checking later
	order.paymentIntentId = paymentIntentId;
	order.status = "paid";
	await order.save();
	res.status(StatusCodes.OK).json({ order });
};

const getAllOrders = async (req, res) => {
	const orders = await Order.find({});
	res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const getSingleOrder = async (req, res) => {
	const { id: orderId } = req.params;

	if (mongoose.Types.ObjectId.isValid(orderId)) {
		const order = await Order.findOne({ _id: orderId })
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

export {
	createOrder,
	updateOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
};

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
		clientSecret: order.clien_secret,
	});
};

const updateOrder = (req, res) => {
	res.send("update order");
};

const getAllOrders = (req, res) => {
	res.send("get all orders");
};

const getSingleOrder = (req, res) => {
	res.send("create single order");
};

const getCurrentUserOrders = (req, res) => {
	res.send("get current user orders");
};

export {
	createOrder,
	updateOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
};

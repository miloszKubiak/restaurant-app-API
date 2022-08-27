import Order from "../models/Order.js";
import { StatusCodes } from "http-status-codes";

const createOrder = (req, res) => {
	res.send("create order");
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

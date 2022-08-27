import express from "express";
import authenticateUser from "../middleware/auth.js";
import {
	createOrder,
	updateOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/").post(authenticateUser, createOrder);
// .get(authenticateUser, authorizePermissions("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);
router
	.route("/:id")
	.get(authenticateUser, getSingleOrder)
	.patch(authenticateUser, updateOrder);

export default router;

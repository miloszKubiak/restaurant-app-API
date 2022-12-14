import express from "express";
import auth from "../middleware/auth.js";
import authorizePermissions from "../middleware/authentication.js";
import {
	createOrder,
	updateOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
	deleteOrder,
	showAllStats,
	showMyStats,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/showAllMyOrders").get(auth, getCurrentUserOrders);
router.route("/all-stats").get(auth, showAllStats);
router.route("/my-stats").get(auth, showMyStats);
router
	.route("/:id")
	.get(auth, getSingleOrder)
	.patch(auth, updateOrder)
	.delete(auth, deleteOrder);
router
	.route("/")
	.post(auth, createOrder)
	// .get(auth, authorizePermissions("admin"), getAllOrders);
	.get(auth, getAllOrders); /// add authorizes permissions !

export default router;

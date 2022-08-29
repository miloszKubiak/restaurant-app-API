import express from "express";
import auth from "../middleware/auth.js";
import authorizePermissions from "../middleware/authentication.js";
import {
	createOrder,
	updateOrder,
	getAllOrders,
	getSingleOrder,
	getCurrentUserOrders,
} from "../controllers/orderController.js";

const router = express.Router();

router.route("/showAllMyOrders").get(auth, getCurrentUserOrders);

router
	.route("/:id")
	.get(auth, getSingleOrder)
	.patch(auth, updateOrder);
router
	.route("/")
	.post(auth, createOrder)
	// .get(auth, authorizePermissions("admin"), getAllOrders);
	.get(auth, getAllOrders); /// add authorizes permissions !
export default router;

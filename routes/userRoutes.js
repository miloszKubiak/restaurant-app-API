import express from "express";
import {
	updateUser,
	getAllUsers,
	getSingleUser,
} from "../controllers/userController.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/").get(getAllUsers);
router.route("/:id").get(getSingleUser);

export default router;

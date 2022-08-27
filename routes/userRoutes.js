import express from "express";
import { updateUser } from "../controllers/userController.js";
import authenticateUser from "../middleware/auth.js";

const router = express.Router();

router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;

import express from "express";
import { register, login } from "../controllers/authController.js";
import rateLimiter from "express-rate-limit";

const router = express.Router();

const apiLimiter = rateLimiter({
	windowsMs: 15 * 60 * 1000, // 15 minutes,
	max: 10,
	message:
		"Too many requests from this IP address, please try again after 15 minutes",
});

router.route("/register").post(apiLimiter, register);
router.route("/login").post(apiLimiter, login);

export default router;

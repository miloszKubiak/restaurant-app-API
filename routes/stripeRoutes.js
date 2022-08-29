import express from "express";
import auth from "../middleware/auth.js";
import { stripeController } from "../controllers/stripeController.js";

const router = express.Router();

router.route("/").post(stripeController); //check authentication

export default router;

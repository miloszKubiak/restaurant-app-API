import express from "express";
import {
	getAllMeals,
	getAllMealsStatic,
} from "../controllers/mealController.js";

const router = express.Router();

router.route("/").get(getAllMeals);
router.route("/static").get(getAllMealsStatic);

export default router;

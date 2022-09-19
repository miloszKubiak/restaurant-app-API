import express from "express";
import auth from "../middleware/auth.js";
import {
	getAllMeals,
	getSingleMeal,
	createMeal,
} from "../controllers/mealController.js";

const router = express.Router();

router.route("/").get(getAllMeals).post(auth, createMeal); //check admin later;
router.route("/:id").get(getSingleMeal);

export default router;

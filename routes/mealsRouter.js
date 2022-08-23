import express from "express";
import { getAllMeals, getSingleMeal } from "../controllers/mealController.js";

const router = express.Router();

router.route("/").get(getAllMeals);
router.route("/:id").get(getSingleMeal)

export default router;

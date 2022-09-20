import express from "express";
import auth from "../middleware/auth.js";
import {
	getAllMeals,
	getSingleMeal,
	createMeal,
	updateMeal,
	deleteMeal,
} from "../controllers/mealController.js";
// import { checkPermissions } from "../utils/checkPermissions.js";

const router = express.Router();

router.route("/").get(getAllMeals).post(auth, createMeal); //check admin later;
router
	.route("/:id")
	.get(getSingleMeal)
	.patch(auth, updateMeal)
	.delete(deleteMeal);

export default router;

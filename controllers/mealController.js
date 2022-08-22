import Meal from "../models/Meal.js";

const getAllMealsStatic = async (req, res) => {
	const meals = await Meal.find({}).sort("-name price");
	res.status(200).json({ nbHits: meals.length, meals });
};

const getAllMeals = async (req, res) => {
	const { name, category, featured } = req.query;

	const queryObject = {};

	if (featured) {
		queryObject.featured = featured === "true" ? true : false;
	}
	if (category) {
		queryObject.category = category;
	}
	if (name) {
		queryObject.name = { $regex: name, $options: "i" };
	}

	const meals = await Meal.find(queryObject);
	res.status(200).json({ nbHits: meals.length, meals });
};

export { getAllMealsStatic, getAllMeals };

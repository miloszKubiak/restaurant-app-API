import Meal from "../models/Meal.js";

const getAllMealsStatic = async (req, res) => {
	const meals = await Meal.find({}).sort("-name price");
	res.status(200).json({ nbHits: meals.length, meals });
};

const getAllMeals = async (req, res) => {
	const { name, category, featured, sort } = req.query;

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

	let result = Meal.find(queryObject);
	
	if (sort === "a-z") {
		result = result.sort("name");
	}
	if (sort === "z-a") {
		result = result.sort("-name");
	}
	if (sort === "price-lowest") {
		result = result.sort("price");
	}
	if (sort === "price-highest") {
		result = result.sort("-price");
	}

	const meals = await result;
	res.status(200).json({ nbHits: meals.length, meals });
};

export { getAllMealsStatic, getAllMeals };

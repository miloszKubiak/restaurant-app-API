import Meal from "../models/Meal.js";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/custom-api.js";

const getSingleMeal = async (req, res) => {
	const { id: mealId } = req.params;

	const meal = await Meal.findOne({ _id: mealId });

	if (!meal) {
		throw new CustomAPIError(`No meal with id: ${mealId}`);
	}

	res.status(StatusCodes.OK).json({ meal });
};

const getAllMeals = async (req, res) => {
	const { search, category, sort } = req.query;

	const queryObject = {};

	//filtering
	if (category && category !== "all") {
		queryObject.category = category;
	}
	if (search) {
		queryObject.name = { $regex: search, $options: "i" };
	}
	console.log(queryObject);
	let result = Meal.find(queryObject);

	//filtering
	// if (featured) {
	// 	queryObject.featured = featured === "true" ? true : false;
	// }
	// if (search) {
	// 	queryObject.name = { $regex: search, $options: "i" };
	// }
	// if (numericFilters) {
	// 	const operatorMap = {
	// 		">": "$gt",
	// 		">=": "$gte",
	// 		"=": "$eq",
	// 		"<": "$lt",
	// 		"<=": "$lte",
	// 	};
	// 	const regEx = /\b(<|>|>=|=|<|<=)\b/g;
	// 	let filters = numericFilters.replace(
	// 		regEx,
	// 		(match) => `-${operatorMap[match]}-`
	// 	);
	// 	const options = ["price", "averageRating"];
	// 	filters = filters.split(",").forEach((item) => {
	// 		const [field, operator, value] = item.split("-");
	// 		if (options.includes(field)) {
	// 			queryObject[field] = { [operator]: Number(value) };
	// 		}
	// 	});
	// }
	// let result = Meal.find(queryObject);

	//sort
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

	//pagination
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);

	const meals = await result;

	const totalMeals = await Meal.countDocuments(queryObject);
	const numOfPages = Math.ceil(totalMeals / limit);

	res.status(StatusCodes.OK).json({
		totalMeals,
		meals,
		numOfPages,
	});
};

export { getAllMeals, getSingleMeal };

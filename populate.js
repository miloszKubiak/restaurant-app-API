import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import Meal from "./models/Meal.js";
import { readFile } from "fs/promises";

dotenv.config();

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		await Meal.deleteMany();

		const jsonData = JSON.parse(
			await readFile(new URL("./mock/mock-data.json", import.meta.url))
		);

		await Meal.create(jsonData);
		console.log("*****Success*****");
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};
start();

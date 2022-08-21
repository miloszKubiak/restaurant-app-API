import mongoose from "mongoose";

const MealSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please provide meal name"],
			trim: true,
			maxLength: [100, "Name can not be more than 100 characters"],
		},
		price: {
			type: Number,
			required: [true, "Please provide meal price"],
			default: 0,
		},
		description: {
			type: String,
			required: [true, "Please provide meal description"],
			maxLength: [
				1000,
				"Description can not be more than 1000 characters",
			],
		},
		image: {
			type: String,
			required: [true, "Please provide meal name"],
			default: "/uploads/example.jpeg",
		},
		category: {
			type: String,
			required: [true, "Please provide meal category"],
			enum: ["pizza", "pasta", "soup", "salad", "dessert"],
		},
		size: {
			type: String,
			enum: ["small", "normal", "large"],
			default: "normal",
			required: true,
		},
		featured: {
			type: Boolean,
			default: false,
		},
		averageRating: {
			type: Number,
			default: 0,
		},
		numberOfReviews: {
			type: Number,
			default: 0,
		},
		// user: {
		// 	type: mongoose.Types.ObjectId,
		// 	ref: "User",
		// 	required: true,
		// },
	},
	{ timestamps: true }
);

export default mongoose.model("Meal", MealSchema);

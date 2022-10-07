import mongoose from "mongoose";

const SingleOrderItemSchema = mongoose.Schema({
	name: { type: String, required: true },
	price: { type: Number, required: true },
	amount: { type: Number, required: true },
	image: { type: String, required: true },
	id: {
		type: mongoose.Types.ObjectId,
		ref: "Meal",
		required: true,
	},
});

const OrderSchema = mongoose.Schema(
	{
		tax: {
			type: Number,
			required: true,
		},
		deliveryFee: {
			type: Number,
			required: true,
		},
		subtotal: {
			type: Number,
			required: true,
		},
		total: {
			type: Number,
			required: true,
		},
		orderItems: [SingleOrderItemSchema], //validation for the cart items
		status: {
			type: String,
			enum: ["sent", "paid", "delivered", "canceled"],
			default: "paid",
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		clientSecret: {
			type: String,
			required: true,
		},
		paymentIntentId: {
			type: String,
		},
		deliveryAddress: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Order", OrderSchema);

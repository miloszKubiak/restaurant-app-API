import mongoose from "mongoose";

const SingleCartItemSchema = mongoose.Schema({
	name: { type: String, required: true },
	price: { type: String, required: true },
	amount: { type: Number, required: true },
	image: { type: String, required: true },
	meal: {
		type: mongoose.Schema.ObjectId,
		ref: "Meal",
		required: true,
	},
});

const OrderSchema = mongoose.Schema(
	{
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
		cartItems: [SingleCartItemSchema], //validation for the cart items
		status: {
			type: String,
			enum: ["pending", "failed", "paid", "delivered", "canceled"],
			default: "pending",
		},
		user: {
			type: mongoose.Schema.ObjectId,
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
	},
	{ timestamps: true }
);

export default mongoose.model("Order", OrderSchema);

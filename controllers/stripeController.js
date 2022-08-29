import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET);

const stripeController = async (req, res) => {
	const { cart, total_amount, delivery_fee } = req.body;

	const calculateOrderAmount = () => {
		return total_amount + delivery_fee;
	};

	const paymentIntent = await stripe.paymentIntents.create({
		amount: calculateOrderAmount(),
		currency: "eur",
	});

	res.json({ clientSecret: paymentIntent.client_secret });
};

export { stripeController };

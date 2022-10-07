import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET);

const stripeController = async (req, res) => {
	const { cart, total_amount, delivery_fee } = req.body;

	const calculateOrderAmount = () => {
		return total_amount + delivery_fee;
	};
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });

};

export { stripeController };

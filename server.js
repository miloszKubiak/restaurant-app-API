import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import "express-async-errors";
import morgan from "morgan";

import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";

import authRouter from "./routes/authRoutes.js";
import mealsRouter from "./routes/mealsRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
	app.use(morgan("dev"));
}

app.use(express.json());

app.get("/api/v1", (req, res) => {
	res.json({ msg: "api" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/meals", mealsRouter);
app.use("/api/v1/orders", orderRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL);
		app.listen(port, () => {
			console.log(
				`******** Server is listening on port ${port} ********`
			);
		});
	} catch (error) {
		console.log(error);
	}
};
start();

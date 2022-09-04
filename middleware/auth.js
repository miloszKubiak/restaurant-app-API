import { UnAuthenticatedError } from "../errors/index.js";
import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer")) {
		throw new UnAuthenticatedError("Authentication Invalid 1");
	}
	const token = authHeader.split(" ")[1];
	console.log(token)
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = { userId: payload.userId };
		next();
	} catch (error) {
		throw new UnAuthenticatedError("Authentication Invalid 2");
	}
};

export default auth;

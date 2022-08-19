import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/index.js";

const updateUser = async (req, res) => {
	const { email, name, lastName, location } = req.body;
	if (!email || !name || !lastName || !location) {
		throw new BadRequestError("Please provide all values");
	}

	const user = await User.findOne({ _id: req.user.userId });

	user.email = email;
	user.name = name;
	user.lastName = lastName;
	user.location = location;

	await user.save();

	const token = user.createJWT();

	res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

export { updateUser };

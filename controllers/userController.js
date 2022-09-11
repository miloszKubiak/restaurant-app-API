import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const getAllUsers = async (req, res) => {
	const users = await User.find({ role: "user" }).select("-password");
	res.status(StatusCodes.OK).json({ users });
};

const getSingleUSer = async (req, res) => {
	const user = await User.findOne({ _id: req.params.id }).select("-password");
	if (!user) {
		throw new NotFoundError(`No user with id: ${req.params.id}`);
	}
	res.status(StatusCodes.OK).json({ user });
};

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

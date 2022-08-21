const getAllMealsStatic = async (req, res) => {
	res.status(200).json({ msg: "meals testing route" });
};

const getAllMeals = async (req, res) => {
	res.status(200).json({ msg: "meals route" });
};

export { getAllMealsStatic, getAllMeals };

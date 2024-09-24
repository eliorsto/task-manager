const bcrypt = require("bcrypt");
const { User } = require("../model/User.js");

const userService = {
	getUser: async (filter) => {
		try {
			if (!filter) return;
			const user = await User.findOne(filter);

			return user;
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	createUser: async (fullName, username, email, password) => {
		try {
			if (!fullName || !username || !email || !password) return;

			const hashedPassword = await bcrypt.hash(password, +(process.env.SALT_ROUNDS || 10));

			const newUser = await new User({
				fullName,
				username,
				email,
				password: hashedPassword,
			}).save();

			return newUser;
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	updateUser: async (filter, update) => {
		try {
			if (!filter || !update) return;

			await User.updateOne(filter, update, { new: true });
		} catch (error) {
			console.error(error.message);
			return;
		}
	}
}

module.exports = { userService };
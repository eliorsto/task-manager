const jwt = require("jsonwebtoken");
const { Token } = require("../model/Token.js");

const tokenService = {
	get: async (token) => {
		if (!token) return;

		try {
			const accessToken = await Token.findOne({ token });
			return accessToken;
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	create: async (id, token) => {
		try {
			if (!id || !token) return;

			await new Token({ userId: id, token }).save();
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	delete: async (token) => {
		try {
			if (!token) return;

			await Token.deleteMany({ token });
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	generate: (id) => {
		return jwt.sign({ id }, process.env.JWT_SECRET, {
			expiresIn: "1h"
		});
	}
}

module.exports = { tokenService };
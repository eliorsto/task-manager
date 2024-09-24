const jwt = require("jsonwebtoken");
const { RefreshToken } = require("../model/RefreshToken.js");

const refreshTokenService = {
	get: async (token) => {
		try {
			if (!token) return;
			const refreshToken = await RefreshToken.findOne({ token });

			if (!refreshToken) return;

			return refreshToken;
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	create: async (id, token) => {
		try {
			if (!id || !token) return;

			await new RefreshToken({ userId: id, token }).save();
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	delete: async (token) => {
		try {
			if (!token) return;

			await RefreshToken.deleteOne({ token });
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	generate: (id) => {
		return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
			expiresIn: "7d"
		});
	}
}

module.exports = { refreshTokenService };
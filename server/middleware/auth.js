const { tokenService } = require("../controller/token.js");
const { userService } = require("../controller/user.js");

const checkToken = async (req, res, next) => {
	const { token } = req.headers;

	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}

	try {
		const accessToken = await tokenService.get(token);
		if (!accessToken) {
			return res.status(401).json({ message: 'Invalid token' });
		}

		const user = await userService.getUser({ _id: accessToken.userId });
		if (!user) {
			return res.status(401).json({ message: 'Invalid token' });
		}
		req.user = user;
		next();
	} catch (error) {
		console.error('Error verifying token:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

module.exports = { checkToken };
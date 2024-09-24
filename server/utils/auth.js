const { refreshTokenService } = require("../controller/refreshToken.js");
const { tokenService } = require("../controller/token.js");

const createTokens = async (id) => {
  const token = tokenService.generate(id);
  const refreshToken = refreshTokenService.generate(id);

  try {
    await tokenService.create(id, token);
    await refreshTokenService.create(id, refreshToken);

    return { token, refreshToken };
  } catch (error) {
    console.error(error.message);
    return;
  }
}

const replaceAccessToken = async (refreshToken) => {
  try {
    const token = await refreshTokenService.get(refreshToken);
    if (!token) return;

    const newToken = tokenService.generate(token.userId);
    await tokenService.create(token.userId, newToken);

    return newToken;
  } catch (error) {
    console.error(error.message);
    return;
  }
}

module.exports = {
  createTokens,
  replaceAccessToken
}
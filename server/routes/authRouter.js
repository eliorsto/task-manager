const bcrypt = require("bcrypt");
const { Router } = require("express");
const { userService } = require("../controller/user.js");
const { refreshTokenService } = require("../controller/refreshToken.js");
const { tokenService } = require("../controller/token.js");
const { createTokens, replaceAccessToken } = require("../utils/auth.js");
const {
  mail,
  getMailTemplateWithLink,
  generateResetToken,
  verifyResetToken,
} = require("../services/mail.js");
const { taskService } = require("../controller/Task.js");
const { chatService } = require("../controller/chat.js");

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userService.getUser({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const { token, refreshToken } = await createTokens(user._id);

    const tasks = await taskService.getTasks(user._id);
    const chats = await chatService.getChats(user._id);

    res.status(200).json({ id: user._id, fullName: user.fullName, token, refreshToken, subjects: user.subjects, tasks, chats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const user = await userService.getUser({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await userService.createUser(
      fullName,
      username,
      email,
      password
    );

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    const { token, refreshToken } = await createTokens(newUser._id);
    const chats = await chatService.getChats(newUser._id);

    res.status(201).json({ token, refreshToken, chats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { token, refreshtoken } = req.headers;

    await tokenService.delete(token);
    await refreshTokenService.delete(refreshtoken);
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/replace", async (req, res) => {
  try {
    const { refreshtoken } = req.headers;

    if (!refreshtoken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userToken = await refreshTokenService.get(refreshtoken);
    if (!userToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const user = await userService.getUser({ _id: userToken.userId });
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const tasks = await taskService.getTasks(user._id);
    const chats = await chatService.getChats(user._id);

    const token = await replaceAccessToken(userToken.token);
    res.status(200).json({ token, fullName: user.fullName, tasks, subjects: user.subjects, chats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await userService.getUser({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  try {
    const resetToken = generateResetToken();

    const msg = getMailTemplateWithLink(
      user.fullName,
      `${process.env.FRONTEND_URL}/auth/reset-password?id=${user._id}&token=${resetToken}`
    );
    const res = await mail(email, "Reset Password", msg);

    res.status(200).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/reset-password", async (req, res) => {
  const { id, token, password } = req.body;

  const user = await userService.getUser({ _id: id });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isValidToken = verifyResetToken(token);
  if (!isValidToken) {
    return res.status(401).json({ message: "Session expired" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, +(process.env.SALT_ROUNDS || 10));
    await userService.updateUser({ _id: id }, { password: hashedPassword });

    res.status(200).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/valid-username", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await userService.getUser({ username });
    if (user) {
      return res.status(400).json({ message: "Invalid username" });
    }
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/valid-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userService.getUser({ email });
    if (user) {
      return res.status(400).json({ message: "Invalid email" });
    }
    res.status(200).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = { router }
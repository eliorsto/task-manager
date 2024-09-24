require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { connectDB } = require("./db.js");
const { chatService } = require("./controller/chat.js");
const { router: authRouter } = require("./routes/authRouter.js");
const { router: userRouter } = require("./routes/userRouter.js");
const { tokenService } = require("./controller/token.js");
const { userService } = require("./controller/user.js");

const app = express();
const server = createServer(app);
const socket = new Server(server, {
	cors: {
		origin: process.env.FRONTEND_URL,
		methods: ["GET", "POST"]
	}
});

const port = process.env.PORT || 5000;

const nodeEnv = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';
const hostingDir = nodeEnv === 'development' ? '' : '/or/projects/task-manager/server';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(`${hostingDir}/auth`, authRouter);
app.use(`${hostingDir}/user`, userRouter);

app.get(`${hostingDir}/`, (_req, res) => {
	res.send("<h1>Server is working</h1>");
});

socket.on("connection", (client) => {
	client.on("join", async ({ chatId, token }) => {
		const chat = await chatService.get({ _id: chatId });

		if (chat) {
			client.join(chatId);
			client.emit("history", chat.messages);

			const accessToken = await tokenService.get(token);
			const user = await userService.getUser({ _id: accessToken.userId });
			if (!user) return;

			client.emit("user", user._id);
		}
	});

	client.on("message", async ({ chatId, message, token }) => {
		const accessToken = await tokenService.get(token);
		const user = await userService.getUser({ _id: accessToken.userId });
		if (!user) return;

		const newMessage = { fullName: user.fullName, message, timestamp: new Date(), self: user._id };

		await chatService.pushMessage(chatId, newMessage);
		socket.to(chatId).emit("message", newMessage);
	});
});

connectDB().then(() =>
	server.listen(port, async () => {
		console.log(`Server is running on port ${port}`);
	})
).catch((error) => {
	console.error(error);
});
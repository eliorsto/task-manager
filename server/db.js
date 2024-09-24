const mongoose = require("mongoose");
const { chatService } = require("./controller/chat");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    const globalChats = [{ title: 'Global Chat', icon: "MessageSquare" }, { title: 'Bug Reports', icon: "Bug" }];

    globalChats.forEach(async (channel) => {
      const chat = await chatService.get({ title: channel.title });
      if (!chat) await chatService.create(channel.title, channel.icon);
    });

    console.log("MongoDB connected");
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connectDB }
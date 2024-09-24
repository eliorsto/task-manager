const { Chat } = require("../model/Chat.js");

const chatService = {
	get: async (filter) => {
		try {
			if (!filter) return;

			const chat = await Chat.findOne(filter);
			if (!chat) return;

			return chat;
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	getChats: async (id) => {
		try {
			const chats = await Chat.find({ $or: [{ users: id }, { users: { $size: 0 } }] }, { _id: 1, title: 1, icon: 1 });

			const categorizedChats = {
				global: chats.filter(chat => !chat?.users),
				personal: chats.filter(chat => chat?.users?.includes(userId))
			};
			if (!categorizedChats) return;

			return categorizedChats;
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	create: async (title, icon = "", users = [], creatorId = "") => {
		try {
			if (!title) return;

			await new Chat({ title, icon, users, creatorId }).save();
		} catch (error) {
			console.error(error.message);
			return;
		}
	},
	pushMessage: async (id, message) => {
		try {
			const chat = await Chat.findOne({ _id: id });
			if (!chat) return;

			const messages = chat.messages;
			messages.push(message)

			await Chat.updateOne({ _id: id }, { messages })
		} catch (error) {
			console.error(error.message);
			return;
		}
	}
}

module.exports = { chatService };
const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		messages: {
			type: Array,
			default: [],
		},
		users: {
			type: Array,
			default: [],
			ref: "User",
		},
		creatorId: {
			type: String,
			default: "",
			ref: "User"
		},
		icon: {
			type: String,
			default: "",
		}
	},
	{ versionKey: false }
);

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = { Chat };

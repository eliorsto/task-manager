const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
		},
		subject: {
			type: String,
		},
		status: {
			type: Boolean,
			default: false,
			required: true
		},
		// date: {
		// 	type: String,
		// 	required: true,
		// },
		createdAt: {
			type: Date,
			default: Date.now,
		},
		progress: {
			type: Array,
			default: []
		}
	},
	{ versionKey: false }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = { Task };
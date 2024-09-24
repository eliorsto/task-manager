const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		tasks: {
			type: Array,
			default: [],
		},
		subjects: {
			type: Array,
			default: [],
		},
		users: {
			type: Array,
			required: true,
			ref: "User",
		},
	},
	{ versionKey: false }
);

const Team = mongoose.model("Team", TeamSchema);

module.exports = { Team };

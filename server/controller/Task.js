const { Task } = require("../model/Task.js");

const taskService = {
	getTasks: async (userId) => {
		try {
			const tasks = await Task.find({ userId });
			return tasks;
		} catch (err) {
			console.error(err.message);
			return;
		}
	},
	getTask: async (id) => {
		try {
			const task = await Task.findById(id);
			return task;
		} catch (err) {
			console.error(err.message);
			return;
		}
	},
	createTask: async (userId, title, progress, subject, description = "") => {
		if (!userId || !title) return;

		try {
			const task = await new Task({
				userId,
				title,
				description,
				status: false,
				subject,
				progress
			}).save();
			return task;
		} catch (err) {
			console.error(err.message);
			return;
		}
	},
	deleteTask: async (id) => {
		if (!id) return;

		try {
			await Task.deleteOne({ _id: id });
		} catch (err) {
			console.error(err.message);
			return;
		}
	},
	updateTask: async (filter, update) => {
		try {
			if (!filter || !update) return;

			const task = await Task.findOneAndUpdate(filter, update, { new: true });
			return task;
		} catch (error) {
			console.error(error.message);
			return;
		}
	}
}

module.exports = { taskService };
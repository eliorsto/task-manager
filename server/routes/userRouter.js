const { Router } = require("express");
const bcrypt = require("bcrypt");
const { checkToken } = require("../middleware/auth.js");
const { userService } = require("../controller/user.js");
const { taskService } = require("../controller/Task.js");

const router = Router();

router.use(checkToken);

router.post("/add-subject", async (req, res) => {
	const { subject } = req.body;

	try {
		const subjects = req.user.subjects;
		const subjectList = subjects.map(sub => sub.name);

		if (subjectList.includes(subject.name)) {
			return res.status(400).json({ message: "Subject already added" });
		}
		subjects.push({ name: subject, amount: 0, timeSpent: 0 });

		await userService.updateUser({ _id: id }, { subjects });
		res.status(200).end();
	} catch (err) {
		res.status(500).json({ message: "Error adding subject" });
	}
});

router.patch("/update-subject", async (req, res) => {
	const { oldSubject, subject } = req.body;

	try {
		const subjects = req.user.subjects;
		const subjectList = subjects.map(sub => sub.name);

		subjects.splice(subjectList.indexOf(oldSubject), 1, {
			name: subject,
			amount: sub.amount,
			timeSpent: sub.timeSpent
		});

		const tasks = req.user.tasks;
		const newTasks = tasks.map(task => {
			return task.subject == oldSubject ? { ...task, subject } : task;
		});

		await userService.updateUser({ _id: id }, { subjects, tasks: newTasks });
		res.status(200).end();
	} catch (err) {
		res.status(500).json({ message: "Error adding subject" });
	}
});

router.delete("/delete-subject", async (req, res) => {
	const { id, subject } = req.body;

	try {
		const subjects = req.user.subjects;
		const subjectList = subjects.map(sub => sub.name);
		subjects.splice(subjectList.indexOf(subject), 1);

		const tasks = req.user.tasks;
		const newTasks = tasks.map(task => {
			return task.subject == subject ? { ...task, subject: "" } : task;
		});

		await userService.updateUser({ _id: id }, { subjects, tasks: newTasks });
		res.status(200).end();
	} catch (err) {
		res.status(500).json({ message: "Error adding subject" });
	}
});

router.get("/get-tasks", async (req, res) => {
	try {
		const tasks = await taskService.getTasks(req.user._id);
		res.status(200).json({ tasks });
	} catch (error) {
		res.status(500).json({ message: "Error fetching tasks" });
	}
});

router.post("/add-task", async (req, res) => {
	const { title, progress, subject, description } = req.body;

	try {
		const task = await taskService.createTask(req.user._id, title, progress, subject, description);

		const subjects = req.user.subjects;

		const subjectList = subjects.map(sub => sub.name);

		if (subject) {
			if (!subjectList.includes(subject)) {
				subjects.push({ name: subject, amount: 1, timeSpent: 0 });
				await userService.updateUser({ _id: req.user._id }, { subjects });
			} else {
				const newSubjects = subjects.map(sub => {
					return sub.name === subject ? {
						name: sub.name,
						amount: sub.amount + 1,
						timeSpent: sub.timeSpent
					} : sub;
				});
				await userService.updateUser({ _id: req.user._id }, { subjects: newSubjects });
			}
		}
		res.status(200).json({ task, subjects });
	} catch (err) {
		res.status(500).json({ message: "Error adding subject" });
	}
});

router.patch("/update-task", async (req, res) => {
	const { id, title, progress, subject, description } = req.body;

	try {
		const prevTask = await taskService.getTask(id);
		const task = await taskService.updateTask({ _id: id }, { title, progress, subject, description });

		const subjects = req.user.subjects;

		const subjectList = subjects.map(sub => sub.name);

		if (subject) {
			if (!subjectList.includes(subject)) {
				subjects.push({ name: subject, amount: 1, timeSpent: 0 });
				await userService.updateUser({ _id: req.user._id }, { subjects });
			} else {
				if (subject !== prevTask?.subject) {
					const newSubjects = subjects.map(sub => {
						if (sub.name == prevTask?.subject) {
							return {
								name: sub.name,
								amount: sub.amount - 1,
								timeSpent: sub.timeSpent
							}
						};

						if (sub.name == subject) {
							return {
								name: sub.name,
								amount: sub.amount + 1,
								timeSpent: sub.timeSpent
							}
						}
						return sub;
					});
					await userService.updateUser({ _id: req.user._id }, { subjects: newSubjects });
				}
			}
		}
		res.status(200).json({ task, subjects });
	} catch (err) {
		res.status(500).json({ message: "Error adding subject" });
	}
});

router.delete("/delete-task", async (req, res) => {
	const { id } = req.body;

	try {
		const task = await taskService.getTask(id);

		const subject = task?.subject;
		if (subject) {
			const subjects = req.user.subjects;
			const time = (Date.now() - task.createdAt);

			const newSubjects = subjects.map(sub => {
				return sub.name == subject ? {
					name: sub.name,
					amount: sub.amount,
					timeSpent: sub.timeSpent + time
				} : sub;
			});
			await userService.updateUser({ _id: req.user._id }, { subjects: newSubjects });
		}
		await taskService.deleteTask(id);

		const user = await userService.getUser({ _id: req.user.id });
		res.status(200).json({ subjects: user.subjects }); // add check if user views team or personal tasks
	} catch (err) {
		res.status(500).json({ message: "Error adding subject" });
	}
});

router.patch("/change-password", async (req, res) => {
	try {
		const { newPassword, oldPassword } = req.body;
		const user = req.user;

		const isValidPassword = await bcrypt.compare(oldPassword, user.password);
		if (!isValidPassword) {
			return res.status(401).json({ message: "Password is wrong" });
		}

		const hashedPassword = await bcrypt.hash(newPassword, +(process.env.SALT_ROUNDS || 10));
		await userService.updateUser({ _id: user._id }, { password: hashedPassword });
		res.status(200).end();
	} catch (err) {
		res.status(500).json({ message: "Error updating password" });
	}
})

module.exports = { router };
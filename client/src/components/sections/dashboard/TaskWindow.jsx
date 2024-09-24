import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setTasks, setSubjects } from "@/store/store";
import { url } from "@/backend";
import { Pencil } from 'lucide-react';
import "../../../index.css"
const TaskWindow = ({ onClose, data, newTask }) => {
    const { token, tasks, subjects } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [isChanged, setIsChanged] = useState(newTask);
    const [isCustomSubject, setIsCustomSubject] = useState(false);
    const [editTask, setEditTask] = useState({
        title: {
            info: data.title || "",
            update: newTask
        },
        description: {
            info: data.description || "",
            update: newTask
        },
        subject: {
            info: data.subject || "",
            update: newTask
        }
    });

    useEffect(() => {
        if (newTask) return;

        const changed = Object.values(editTask).filter(task => task.update);
        if (changed.length > 0) setIsChanged(true);
    }, [editTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newData = Object.entries(editTask).map(([key, value]) => {
            return { [key]: value.info }
        }).reduce((acc, obj) => {
            return { ...acc, ...obj };
        }, {});

        try {
            let res;

            if (newTask) {
                res = await axios.post(`${url}/user/add-task`, {
                    ...newData,
                    progress: [],
                }, {
                    headers: {
                        token
                    }
                });
            } else {
                res = await axios.patch(`${url}/user/update-task`, {
                    id: data._id,
                    ...newData,
                    progress: [],
                }, {
                    headers: {
                        token
                    }
                });
            }

            if (res.statusCode == res.ok) {
                if (newTask) {
                    dispatch(setTasks([...tasks, res.data.task]));
                } else {
                    const newTasks = tasks.map(task => {
                        if (task._id == data._id) {
                            return res.data.task;
                        }
                        return task;
                    }).filter(task => task);
                    dispatch(setTasks(newTasks));
                }

                if (res.data.subjects) {
                    dispatch(setSubjects(res.data.subjects));
                }
            }
        } catch (err) {
            console.error(err.message);
        }
        onClose();
    };

    const handleDeleteTask = async () => {
        try {
            const res = await axios.delete(`${url}/user/delete-task`, {
                headers: {
                    token
                },
                data: {
                    id: data._id
                }
            });

            if (res.statusCode == res.ok) {
                const newTasks = tasks.filter(task => task._id != data._id);
                dispatch(setTasks(newTasks));
                dispatch(setSubjects(res.data.subjects));
            }

        } catch (err) {
            console.error(err.message);
        }
        onClose();
    }

    return <>
        <div className="fixed top-[50%] left-[50%] rounded-md -translate-x-[50%] -translate-y-[50%] flex flex-col items-center justify-between w-[60%] h-[70%] border border-blue-500 border-6 z-50 p-6 pt-14 bg-white dark:bg-slate-400">
            <button
                className="absolute top-4 right-4 text-2xl font-bold text-gray-700 hover:text-gray-900"
                onClick={onClose}>
                &times;
            </button>
            <form className="flex flex-col  gap-y-6 space-y-4 h-[85%] w-[90%]" onSubmit={handleSubmit}>
                <div className="flex w-full h-[30%]">
                    <div className="w-[70%] h-full flex flex-col">
                        <p className="text-xl font-semibold h-20">{newTask ? "Add a title to view your progress" : "Task's Title"}</p>
                        <div className="flex w-full items-center h-full gap-x-2">
                            {editTask.title.update ?
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    className="w-[60%] text-2xl bg-gray-100 p-3 border border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Title"
                                    value={editTask.title.info}
                                    onChange={(e) => setEditTask({ ...editTask, title: { ...editTask.title, info: e.target.value } })}
                                    required
                                />
                                : <div className=" flex items-center w-full bg-gray-100 cursor-pointer border border-r-2 border-b-2 border-b-blue-500 border-r-blue-500 text-2xl p-1 rounded-md shadow-sm focus:outline-none hover:text-blue-700"
                                    onClick={() => setEditTask({ ...editTask, title: { ...editTask.title, update: true } })}>
                                    <div className="w-[95%]">{editTask.title.info} &nbsp;</div>
                                    <Pencil width="20px" height="20px" className="items-center" /></div>}
                        </div>
                    </div>
                    <div className="flex w-[30%] h-full flex-col justify-center items-center">
                        <p className="text-xl font-semibold h-20">{newTask ? "Add a subject" : "Task's Subject"}</p>
                        <div className="flex w-full items-center h-full justify-center  gap-x-2">
                            {editTask.subject.update ? (
                                <>
                                    {isCustomSubject ? (
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            className="w-[40%] text-lg p-3 border bg-gray-100  border-blue-500 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Subject"
                                            value={editTask.subject.info}
                                            onChange={(e) => setEditTask({ ...editTask, subject: { ...editTask.subject, info: e.target.value } })}
                                        />
                                    ) : (
                                        <select
                                            id="subject"
                                            name="subject"
                                            className="p-3 border border-blue-500 bg-gray-100  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            onChange={(e) => {
                                                if (e.target.value == "Custom") {
                                                    setIsCustomSubject(true);
                                                } else {
                                                    setEditTask({ ...editTask, subject: { ...editTask.subject, info: e.target.value } })
                                                }
                                            }}
                                        >
                                            <option value="" selected disabled>
                                                Select Subject
                                            </option>
                                            {subjects.map(subject => {
                                                return <option value={subject.name}>{subject.name}</option>
                                            })}
                                            <option value="Custom">Custom</option>
                                        </select>
                                    )}
                                </>
                            ) : (
                                <div
                                    className="w-[80%] flex justify-center items-center border-2 border-blue-500 cursor-pointer text-2xl p-1 bg-gray-100 rounded-md shadow-sm focus:outline-none hover:text-blue-700"
                                    onClick={() => setEditTask({ ...editTask, subject: { ...editTask.subject, update: true } })}>
                                    {editTask.subject.info || "No subject provided"} &nbsp;
                                    <Pencil width="20px" height="20px" className="items-center" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="h-[50%] w-full">
                    <label className="block text-lg font-medium mb-2" htmlFor="description">
                        Description
                    </label>
                    {editTask.description.update ?
                        <textarea
                            id="description"
                            name="description"
                            className="w-full p-3 border h-72 bg-gray-100 border-blue-500 min-h-32 max-h-48 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Type anything you want..."
                            value={editTask.description.info}
                            onChange={(e) => setEditTask({ ...editTask, description: { ...editTask.description, info: e.target.value } })}
                        /> : <div className="w-full h-full flex  text-xl p-3 bg-gray-100 min-h-44 max-h-56 rounded-md cursor-pointer border border-blue-500 shadow-inner hover:text-blue-700"
                            onClick={() => setEditTask({ ...editTask, description: { ...editTask.description, update: true } })}>
                            {editTask.description.info} &nbsp; <Pencil width="20px" height="25px" className="pt-2" />
                        </div>
                    }
                </div>
                <button
                    type="submit"
                    className="absolute bottom-6 disabled:text-gray-400 disabled:bg-neutral-600 right-8 w-40 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!isChanged}
                >
                    {newTask ? "Create Task" : "Save"}
                </button>
            </form>
            {!newTask && <button className="absolute bottom-6 disabled:text-gray-400 disabled:bg-neutral-600 right-52 w-12 flex justify-center items-center text-xl px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-blue-500" onClick={handleDeleteTask}>
                <Trash2 />
            </button>}
        </div>
    </>
};

export default TaskWindow;
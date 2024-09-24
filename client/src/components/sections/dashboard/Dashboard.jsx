import { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { setDate, setLogged } from "@/store/store";
import { useSelector, useDispatch } from 'react-redux';
import { DayPicker } from "react-day-picker";
import TaskWindow from "./TaskWindow";
import Task from "./Task";
import NotLogged from "../NotLogged/NotLogged";
import * as Toast from '@radix-ui/react-toast';
import { CircleCheckBig } from 'lucide-react';
import "react-day-picker/style.css";
import "../../Auth/Auth.css"

const Dashboard = () => {
    const { date, token, backgroundColor, fullName, tasks, logged, handleAuth } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [showTaskWindow, setShowTaskWindow] = useState(undefined);

    useEffect(() => {
        const timeout = setTimeout(() => {
            dispatch(setLogged(false))
        }, 5000);

        return () => {
            clearTimeout(timeout);
        }
    }, [])

    const getUserCapitalizedName = () => {
        const name = fullName.split(" ")[0];
        const capitalizedName = `${name[0].toUpperCase()}${name.slice(1).toLowerCase()}`;
        return capitalizedName;
    }

    return <>
        {token ? <>
            {showTaskWindow && <TaskWindow onClose={() => setShowTaskWindow(undefined)} data={showTaskWindow} newTask={showTaskWindow.title ? false : true} />}
            <div className="flex h-full w-full">
                {logged &&
                    <Toast.Provider swipeDirection="right">
                        <Toast.Root type="background" className={`ToastRoot bg-green-500 text-white flex justify-between items-start `}>
                            <CircleCheckBig width="50px" height="50px" />
                            <div>
                                <Toast.Title className="ToastTitle">{handleAuth ? "Welcome to TaskPilot" : "Welcome back!"}</Toast.Title>
                                <Toast.Description className="ToastDescription" >{handleAuth ? "Start your prograss here" : "Continue your tasks"}</Toast.Description>
                            </div>
                            <Toast.Action className="ToastAction" altText="Goto schedule to undo">
                            </Toast.Action>
                            <Toast.Close className='text-2xl font-bold'>x</Toast.Close >
                        </Toast.Root>
                        <Toast.Viewport className="ToastViewport" hotkey={['altKey']} />
                    </Toast.Provider>}

                <div className="flex flex-col items-center justify-between h-full w-[60%]">
                    <div className="flex flex-col gap-y-3 w-full h-[10%]">
                        <h1 className="text-3xl font-bold text-gray-400 dark:text-white/70">Hello, {getUserCapitalizedName()}!</h1>
                        <h2 className="text-2xl font-semibold text-neutral-900/60 dark:text-gray-200">{tasks.length <= 0 ? "You have no tasks left, Good Job!" : `You've got ${tasks.length} task${tasks.length == 1 ? "" : "s"} left`}</h2>
                    </div>
                    <div className={`h-[80%] self-start w-[90%] overflow-x-hidden overflow-y-scroll gap-y-1 scrollbar-hide pr-4`}>
                        {[...tasks].reverse().filter(task => task).map(task => {
                            return <Task key={task._id} {...task} onClick={() => { if (!showTaskWindow) setShowTaskWindow(task) }} />
                        })}
                    </div>
                </div>
                <div className="flex flex-col h-full w-[40%]">
                    <div className="h-[30%] w-full" >
                        {/* Above calendar */}
                    </div>
                    <div className={`h-[70%] w-full ${backgroundColor} flex justify-around items-center flex-col rounded-3xl`} >
                        <div className="w-[95%] h-[10%] flex justify-around items-center text-2xl font-bold rounded-xl bg-white border-b-8 border-r-8 border-r-neutral-700 pr-2 pl-2 border-b-neutral-700/90 ">
                            <div className="w-[65%]"> {date && `Date: ${new Date(date).toLocaleDateString()}`}</div>
                            <Button className={`${buttonVariants({ variant: "destructive", size: "lg" })} p-0 px-1 w-[35%] h-[80%] shadow-[2px_5px_12px_-3px_rgba(0,0,0,0.67)] bg-blue-600 hover:bg-blue-500  text-lg`} onClick={() => {
                                if (!showTaskWindow) setShowTaskWindow({})
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="30px" width="30px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-plus"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
                                &nbsp; Add task
                            </Button>
                        </div>
                        <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={(e) => {
                                const newDate = e ? e.getTime() : new Date().getTime();
                                dispatch(setDate(newDate));
                            }}
                            className={"text-3xl font-semibold h-[82%] w-[95%] items-center flex justify-center rounded-3xl bg-white shadow-[1px_1px_12px_-3px_rgba(0,0,0,0.67)] border-b-[10px] border-r-[10px] border-r-neutral-700 border-b-neutral-700/90 mb-0 mt-4"}
                            showOutsideDays={true}
                        />
                    </div>
                </div>
            </div>
        </> : <>
            <NotLogged />
        </>
        }
    </>
}

export default Dashboard    
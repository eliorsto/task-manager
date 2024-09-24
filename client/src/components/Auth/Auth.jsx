import { useEffect, useRef, useState } from "react";
import { Button, buttonVariants } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setFullName, setShowAuth, setToken, setHandleAuth, setChats, setTasks, setSubjects } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from 'lucide-react';
import { url } from "@/backend";
import taskPic from "../../assets/dashboard.png"
import axios from "axios";
import * as Toast from '@radix-ui/react-toast';
import { CircleAlert, CircleCheckBig, X } from 'lucide-react';
import { setLogged } from "@/store/store";
import "./Auth.css"

const Auth = () => {
    const { handleAuth } = useSelector(state => state.user);
    const [forgotPassword, setForgotPassword] = useState(false)
    const [valid, setValid] = useState({
        username: true,
        email: true
    });

    const [formData, setFormData] = useState({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [open, setOpen] = useState(null);
    const timerRef = useRef(0);

    const handleChange = async (e) => {
        setOpen(false);

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (handleAuth || forgotPassword) {
            if (valid[e.target.name] == undefined) return;

            try {
                const res = await axios.post(`${url}/auth/valid-${e.target.name}`, {
                    [e.target.name]: e.target.value
                })

                if (res.statusCode == res.ok) {
                    setValid({
                        ...valid,
                        [e.target.name]: true
                    });
                }
            } catch (error) {
                setValid({
                    ...valid,
                    [e.target.name]: false
                });
            }
        }
    }

    useEffect(() => {
        setFormData({
            username: "",
            fullName: "",
            email: "",
            password: "",
            confirmPassword: ""
        });

        setValid({
            username: true,
            email: true,
        })
        setOpen(false)
    }, [handleAuth])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.confirmPassword && formData.confirmPassword !== formData.password) return;

        try {
            const res = await axios.post(`${url}/auth/${forgotPassword ? "forgot-password" : handleAuth ? "register" : "login"}`, { ...formData })

            if (res.statusCode == res.ok) {
                dispatch(setLogged(true))
            }
            dispatch(setToken(res.data.token));
            dispatch(setChats(res.data.chats));
            dispatch(setFullName(formData.fullName ? formData.fullName : res.data.fullName));
            dispatch(setTasks(res.data.tasks || []));
            dispatch(setSubjects(res.data.subjects || []));

            dispatch(setShowAuth(false));
            localStorage.setItem("taskPilot_token", res.data.refreshToken);
            navigate('/home');
        } catch (err) {
            setOpen(false);

            timerRef.current = window.setTimeout(() => {
                setOpen(true);
            }, 100);
        }
    }

    return <>
        <div className="fixed h-screen w-[100%] flex justify-center items-center bg-neutral-700/30 p-0 z-40">
            <Toast.Provider swipeDirection="right">
                <Toast.Root className={`ToastRoot ${!valid.email && forgotPassword ? "bg-green-500" : "bg-red-600"} bg-red-500 text-white flex justify-between items-start `} open={open} onOpenChange={setOpen}>
                    {!valid.email && forgotPassword ?
                        < CircleCheckBig width="50px" height="50px" />
                        :
                        <CircleAlert width="50px" height="50px" />}
                    <div>
                        <Toast.Title className="ToastTitle">{`${!valid.email && forgotPassword ? "Email has been sent" : "someting went worng"}`}</Toast.Title>
                        <Toast.Description className="ToastDescription" >{(!valid.email && forgotPassword) ? "" : forgotPassword ? "Invalid email" : handleAuth ? "Invalid user name or email" : "Invalid user name or password"}</Toast.Description>
                    </div>
                    <Toast.Action className="ToastAction" altText="Goto schedule to undo">
                    </Toast.Action>
                    <Toast.Close className='text-2xl font-bold'>x</Toast.Close >
                </Toast.Root>
                <Toast.Viewport className="ToastViewport" hotkey={['altKey']} />
            </Toast.Provider>
            <div className="relative h-[70%] w-[60%] flex items-center container text-center z-40 border border-black bg-white p-2 rounded-lg">
                <div className="absolute top-1 right-3 w-5">
                    <Button className="p-0 bg-transparent z-50 text-gray-400 hover:text-gray-500 hover:bg-transparent text-2xl" onClick={() => dispatch(setShowAuth(false))}><X /></Button>
                </div>
                <div className={`w-[50%] h-[90%] flex justify-center text-center items-center flex-col transition-transform duration-300 ${handleAuth ? "translate-x-full" : ""}`}>
                    <form action="#" onSubmit={handleSubmit} className="flex select-none flex-col items-center justify-center w-[100%] h-full">
                        {forgotPassword ? <>
                            <h1 className="text-3xl font-bold h-[15%]">Forgot Password</h1>
                            <h2 className="mb-5">Enter your email address and we will send you instructions to reset your password</h2>
                        </>
                            : handleAuth ?
                                < h1 className="text-3xl font-bold h-[15%]">Join now!</h1> :
                                <div className="h-[25%] text-start pt-7">
                                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                                    <h2>Please enter login details below</h2>
                                </div>}
                        {!forgotPassword &&
                            <div className="flex items-center justify-center m-2">
                                <div className="relative">
                                    <input id="username" name="username" type="text" onChange={handleChange} value={formData.username} required
                                        className="border w-[100%] border-blue-700 py-1 focus:border-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit rounded-xl p-3" />
                                    <label htmlFor="username"
                                        className={`absolute ${formData.username ? "text-xs text-blue-700 -top-4" : "top-1"} left-0 cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 pl-3`}
                                    >User Name</label>
                                    {!valid.username && <>
                                        <div className="text-red-500 w-[100%] text-right text-sm flex items-center">
                                            <CircleAlert className="w[10%]" width="19px" height="19px" strokeWidth="1.75px" />
                                            &nbsp;
                                            <p className="w-[90%] text-left">Invalid username</p>
                                        </div>
                                    </>}
                                </div>
                            </div>}
                        {handleAuth && <>
                            <div className="flex items-center justify-center m-2">
                                <div className="relative">
                                    <input id="fullName" name="fullName" type="text" onChange={handleChange} value={formData.fullName}
                                        className="border w-[100%] border-blue-700 py-1 focus:border-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit rounded-xl p-3" />
                                    <label htmlFor="fullName"
                                        className={`absolute left-0  ${formData.fullName ? "text-xs text-blue-700 -top-4" : "top-1"} cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 pl-3`}
                                    >Full Name</label>
                                </div>
                            </div>
                        </>}
                        {(forgotPassword || handleAuth) && <>
                            < div className="flex items-center justify-center m-2">
                                <div className="relative">
                                    <input id="email" name="email" type="email" onChange={handleChange} value={formData.email} required
                                        className="border w-[100%] border-blue-700 py-1 focus:border-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit rounded-xl p-3" />
                                    <label htmlFor="email"
                                        className={`absolute left-0  ${formData.email ? "text-xs text-blue-700 -top-4" : "top-1"} cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 pl-3`}
                                    >Email Address</label>
                                    {(!valid.email && !forgotPassword || valid.email && forgotPassword && formData.email) && <>
                                        <div className="text-red-500 w-[100%] text-right text-sm flex items-center">
                                            <CircleAlert className="w[10%]" width="19px" height="19px" strokeWidth="1.75px" />
                                            &nbsp;
                                            <p className="w-[90%] text-left">Invalid email</p>
                                        </div>
                                    </>}
                                </div>
                            </div>
                        </>}
                        {!forgotPassword &&
                            < div className="flex items-center justify-center m-2">
                                <div className="relative">
                                    <input
                                        id="password" name="password" type="password" onChange={handleChange} value={formData.password} required
                                        className="border w-[100%] border-blue-700 py-1 focus:border-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit rounded-xl p-3" />
                                    <label htmlFor="password"
                                        className={`absolute left-0  ${formData.password ? "text-xs text-blue-700 -top-4" : "top-1"} cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 pl-3`}
                                    >Password</label>
                                    {!handleAuth &&
                                        <div className="w-[100%] text-right text-sm cursor-pointer hover:underline"><a onClick={() => setForgotPassword(true)}>Forgot password?</a></div>}
                                </div>
                            </div>}
                        {handleAuth &&
                            <div className="flex items-center justify-center m-2">
                                <div className="relative">
                                    <input
                                        id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} value={formData.confirmPassword} required
                                        className="border w-[100%] border-blue-700 py-1 focus:border-2 focus:border-blue-700 transition-colors focus:outline-none peer bg-inherit rounded-xl p-3" />
                                    <label htmlFor="confirmPassword"
                                        className={`absolute left-0  ${formData.confirmPassword ? "text-xs text-blue-700 -top-4" : "top-1"} cursor-text peer-focus:text-xs peer-focus:-top-4 transition-all peer-focus:text-blue-700 pl-3`}
                                    >Confirm password</label>
                                    {formData.confirmPassword && formData.confirmPassword !== formData.password && <>
                                        <div className="text-red-500 w-[100%] text-right text-sm flex items-center">
                                            <CircleAlert className="w[10%]" width="19px" height="19px" strokeWidth="1.75px" />
                                            &nbsp;
                                            <p className="w-[90%] text-left">Passwords do not match</p>
                                        </div>
                                    </>}
                                </div>
                            </div>}
                        <div className="w-[100%] h-[20%] pt-5">
                            <Button className={`${buttonVariants({ variant: "secondary", size: "default" })}
                                cursor-pointer transition-all text-center bg-blue-500 text-white w-[40%] rounded-lg border-blue-600 
                                border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] hover:bg-blue-500/95
                                active:border-b-[2px] active:brightness-90 active:translate-y-[2px]`}>
                                {forgotPassword ? "Continue" : handleAuth ? "Sign up" : "Sign in"}
                            </Button>
                        </div>
                    </form>
                    {forgotPassword &&
                        <Button onClick={() => setForgotPassword(false)}
                            className={`${buttonVariants({ variant: "link", size: "default" })} bg-white transition-all text-black hover:bg-white font-normal text-base border border-blue-600 w-[25%] text-center hover:-translate-y-[1px] rounded-xl`}
                        >back <ArrowRight width="16" height="16" /></Button>}
                    <p className="h-[20%]">{!handleAuth && "don't"} have a user? <Button
                        onClick={() => {
                            dispatch(setHandleAuth(!handleAuth))
                            setForgotPassword(false)
                        }}
                        className={`${buttonVariants({ variant: "link", size: "default" })} bg-white hover:bg-white p-0 text-blue-700 `} >
                        {!handleAuth ? "Sign up" : "Sign in"}</Button></p>
                </div>
                <div className={`h-[100%] w-[50%] p-5 transition-transform duration-300 ${handleAuth ? "-translate-x-full " : ""}`}>
                    <div className="h-[100%] bg-indigo-400 border rounded-xl flex flex-col justify-center items-center"
                        style={{
                            background: 'linear-gradient(198deg, #7ca7ff 0%, #9cbcf8 50%, #7664ec 100%)',
                            boxShadow: '0px 0px 10px 4px rgba(0,0,0,0.2) inset'
                        }}>
                        <img src={taskPic} alt="Dashboard" draggable={false} className="w-1/2 select-none h-auto rounded-lg z-10" />
                        <h1 className="text-3xl font-bold italic z-10 select-none">TaskPilot</h1>
                    </div>
                </div>
            </div >
        </div >
    </>
}


export default Auth;
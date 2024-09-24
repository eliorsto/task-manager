import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar/Avatar";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setProfileImage, clearUser, setBackgroundColor, setTheme } from '@/store/store';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import axios from 'axios';
import { CircleAlert, CircleCheckBig, Upload } from 'lucide-react';
import * as Toast from '@radix-ui/react-toast';
import NotLogged from '../NotLogged/NotLogged';
import { url } from '@/backend';

export const colorOptions = [
    { border: 'border-blue-500', class: 'bg-blue-500' },
    { border: 'border-red-400', class: 'bg-red-400' },
    { border: 'border-emerald-400', class: 'bg-emerald-400' },
    { border: 'border-cyan-400', class: 'bg-cyan-400' },
    { border: 'border-purple-400', class: 'bg-purple-400' },
    { border: 'border-rose-700', class: 'bg-rose-700' },
];

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, fullName, backgroundColor, theme, ProfileImage } = useSelector((state) => state.user);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [err, setErr] = useState(false);
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('taskPilot_token');
        dispatch(clearUser());
        navigate('/');
    };

    const handleColorChange = (colorClass) => {
        dispatch(setBackgroundColor(colorClass));
        localStorage.setItem('backgroundColor', colorClass);
    };

    const handleThemeChange = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        dispatch(setTheme(newTheme));
        localStorage.setItem('theme', newTheme);
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setErr("New Passwords do not match");
            setOpen(true);
            return;
        }

        try {
            const res = await axios.patch(
                `${url}/user/change-password`,
                {
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        token,
                    },
                }
            );

            if (res.statusCode === res.ok) {
                setErr(false);
                setOpen(true);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => {
                    navigate('/home');
                }, 1500)
            }
        } catch (error) {
            setErr("Incorrect password");
            setOpen(true);
        }
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch(setProfileImage(reader.result));
            };
            reader.readAsDataURL(file);
        }
    };

    return <>
        {token ? <>

            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 dark:text-gray-200">Welcome Back, {fullName}</h1>
                <div className="flex flex-col items-center space-y-8">
                    <div className="relative group">
                        <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 dark:text-gray-200">
                            <Upload />
                        </div>
                        <Avatar className="h-32 w-32 cursor-pointer dark:text-gray-200">
                            <AvatarImage src={ProfileImage} alt={fullName} />
                            <AvatarFallback className={`text-4xl ${backgroundColor}`}>
                                {fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="w-full space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-2 dark:text-gray-200">Background Color</h2>
                            <div className="flex justify-center space-x-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color.class}
                                        className={`w-8 h-8 rounded-full ${color.class} ${backgroundColor === color.class ? 'ring-2 ring-offset-2 ring-black' : ''}`}
                                        onClick={() => handleColorChange(color.class)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between dark:text-gray-200">
                            <Label htmlFor="theme-mode">Dark Mode</Label>
                            <Switch
                                id="theme-mode"
                                checked={theme === 'dark'}
                                onCheckedChange={handleThemeChange}
                            />
                        </div>
                        <Toast.Provider swipeDirection="right">
                            <Toast.Root type="background" className={`ToastRoot ${err ? "bg-red-600" : "bg-green-500"} text-white flex justify-between items-start `} open={open} onOpenChange={setOpen}>
                                {err ?
                                    <CircleAlert width="50px" height="50px" />
                                    :
                                    <CircleCheckBig width="50px" height="50px" />}
                                <div>
                                    <Toast.Title className="ToastTitle">{`${err ? "Something went wrong" : "Success"}`}</Toast.Title>
                                    <Toast.Description className="ToastDescription" >{err ? err : "Password changed successfully"}</Toast.Description>
                                </div>
                                <Toast.Action className="ToastAction" altText="Goto schedule to undo">
                                </Toast.Action>
                                <Toast.Close className='text-2xl font-bold'>x</Toast.Close >
                            </Toast.Root>
                            <Toast.Viewport className="ToastViewport" hotkey={['altKey']} />
                        </Toast.Provider>
                        <div className="flex justify-between">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="dark:text-gray-200">Change Password</Button>
                                </DialogTrigger>
                                <DialogContent className={`${theme == "dark" && "bg-slate-500"}`}>
                                    <DialogHeader>
                                        <DialogTitle>Change Password</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="old-password">Old Password</Label>
                                            <Input id="old-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                        </div>
                                        <div>
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                        </div>
                                        <div className='flex justify-center w-full'>
                                            <Button className={`bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 ${theme === "dark" &&
                                                'bg-gray-300 text-gray-700 hover:bg-gray-100 dark:bg-slate-600 dark:text-gray-200 dark:hover:bg-slate-500'}`} onClick={handleChangePassword} >Change Password</Button>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button variant="destructive" onClick={handleLogout}>Sign Out</Button>
                        </div>
                    </div>
                </div>
            </div>
        </> : <>
            <NotLogged />
        </>}
    </>
};

export default Settings;
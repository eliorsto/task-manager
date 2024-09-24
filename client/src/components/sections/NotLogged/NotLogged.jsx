import { Button, buttonVariants } from "@/components/ui/button";
import { setHandleAuth, setShowAuth } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";

const NotLogged = () => {
	const { showAuth } = useSelector(state => state.user);
	const dispatch = useDispatch();

	return <div className={`h-full w-full flex flex-col`}>
		<h1 className=" text-5xl font-bold text-center dark:text-white">Welcome to TaskPilot</h1>
		<div className="flex flex-col justify-around h-[90%]">
			<p className="text-xl p-2 text-center dark:text-gray-200">
				TaskPilot is your go-to task management platform designed to help you stay organized,<br />
				prioritize tasks, and achieve your goals efficiently. <br />
				Whether you're juggling multiple projects or simply trying to stay on top of daily tasks, <br />
				TaskPilot offers the tools you need to streamline your workflow and enhance your productivity.
			</p>

			<div className="flex flex-col justify-center items-center">
				<div className="text-2xl text-center">
					<h2 className="font-bold dark:text-white">Ready to get started?</h2>
					<p className="text-xl dark:text-gray-300">Sign up today and experience the power <br /> of organized work with TaskPilot.</p>
				</div>
				<Button className={`${buttonVariants({ variant: "destructive", size: "lg" })} bg-blue-500 hover:bg-blue-400 m-5 font-bold text-xl px-32 py-4`} onClick={() => {
					if (!showAuth) {
						dispatch(setHandleAuth(true))
						dispatch(setShowAuth(true))
					}
				}}>Join us</Button>
			</div>

			<div className="w-full flex flex-col items-center dark:text-gray-200">
				<p>
					For any questions or support, contact us at <a href="#" className="p-1 text-blue-600 dark:text-blue-400 hover:underline">taskpilot@panda.knowledger.guru</a>
				</p>

				<div className=" flex flex-col items-center">
					<div>Connect with us:</div>
					<div>
						<a href="http://instagram.com" className="p-1 text-blue-600 dark:text-blue-400 hover:underline">Instagram</a>|
						<a href="http://linkedIn.com" className="p-1 text-blue-600 dark:text-blue-400 hover:underline">LinkedIn</a>|
						<a href="http://facebook.com" className="p-1 text-blue-600 dark:text-blue-400 hover:underline">Facebook</a>
					</div>
				</div>
			</div>
		</div>
	</div>
}

export default NotLogged;
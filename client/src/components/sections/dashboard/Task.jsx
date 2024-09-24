import { useSelector } from "react-redux";
import { colorOptions } from "../settings/Settings";

const Task = ({ title, subject, description, onClick }) => {
    const { backgroundColor } = useSelector(state => state.user);

    function getBorderColor() {
        const border = colorOptions.filter(item => item.class == backgroundColor)[0];
        return border.border;
    }

    return <>
        <div className={`w-full rounded-2xl shadow-2xl h-[25%] p-4 m-2 dark:bg-gray-300 bg-neutral-100/70 border-r-4 border-b-4 ${getBorderColor()} select-none scale-95 hover:scale-100 transition-transform duration-150 cursor-pointer`} onClick={onClick}>
            <div className="text-3xl text-black font-bold dark:text-black/70">{title}</div>
            <div className="text-xl font-semibold text-gray-500/80">{subject}</div>
            <div className="pt-4 truncate max-w-[80%]">{description}</div>
        </div >
    </>
}

export default Task;
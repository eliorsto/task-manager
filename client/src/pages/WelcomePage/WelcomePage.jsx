import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import bgLightMode from "../../assets/welcomepage_light_mode.jpg";
import bgDarkMode from "../../assets/welcomepage_dark_mode.jpg";

const WelcomePage = () => {
    const navigate = useNavigate();
    const { theme } = useSelector((state) => state.user);

    return (
        <div className="min-h-screen flex flex-col">
            <Toaster />
            <div className="fixed inset-0 -z-10">
                <img src={theme === 'dark' ? bgDarkMode : bgLightMode} className="w-full h-full object-cover" alt="Background" />
            </div>
            <div className="flex-grow flex flex-col items-center justify-center container mx-auto py-8 text-center z-10">
                <h1 className="text-4xl font-bold mb-4 dark:text-white">Welcome to TaskPilot</h1>
                <p className="text-xl text-muted-foreground mb-8">
                    Stay organized and on top of your tasks with our intuitive app.
                </p>
                <Button onClick={() => navigate("/home")} className="mb-12 w-[17%] bg-blue-500 hover:bg-blue-600 font-bold dark:text-white">Get Started</Button>

                <div className="flex w-full justify-around items-center">
                    <FeatureCard
                        icon="📅"
                        title="Task Scheduling"
                        description="Easily schedule and manage your tasks with our intuitive calendar."
                    />
                    <FeatureCard
                        icon="✅"
                        title="Task Tracking"
                        description="Stay on top of your tasks with our comprehensive tracking features."
                    />
                    <FeatureCard
                        icon="🔔"
                        title="Notifications"
                        description="Never miss a deadline with our smart notification system."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="text-card-foreground bg-white/80 p-6 w-[30%] rounded-lg shadow-xl dark:bg-slate-500 select-none">
            <div className="text-4xl mb-4">
                {icon}
            </div>
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground dark:text-gray-200">{description}</p>
        </div>
    );
};

export default WelcomePage;
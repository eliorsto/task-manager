import { useState, lazy, Suspense } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import Dashboard from '../../components/sections/dashboard/Dashboard';
import Analytics from '../../components/sections/analytics/Analytics';
import Documents from '../../components/sections/documents/Documents';
import Settings from '../../components/sections/settings/Settings';
import { useDispatch, useSelector } from 'react-redux';
import { setChats, setShowAuth, setLogged } from '@/store/store';
import NotLogged from '@/components/sections/NotLogged/NotLogged';
import axios from 'axios';
import { url } from '@/backend';

const RemoteTeams = lazy(() => import( /* @vite-ignore */ 'mf-chat/Teams'));

const navigationItems = [
    { path: "/home", label: "Dashboard", icon: "🏠" },
    { path: "/home/analytics", label: "Analytics", icon: "📊" },
    { path: "/home/teams", label: "Teams", icon: "👥" },
    { path: "/home/documents", label: "Documents", icon: "📄" },
];

const Home = () => {
    const [isOpen, setIsOpen] = useState(true);

    const dispatch = useDispatch();
    const { backgroundColor, token, chats } = useSelector((state) => state.user);

    const location = useLocation();
    const navigate = useNavigate();

    const toggleSidebar = () => setIsOpen(!isOpen);

    const handleNavigation = (path) => {
        if (!token) {
            dispatch(setShowAuth(true));
            return;
        }
        dispatch(setLogged(false));
        navigate(path);
    };

    const handleCreateTeam = async (title) => {
        try {
            const res = await axios.post(`${url}/create-team`, { title }, {
                headers: {
                    token
                }
            });

            if (res.statusCode === res.ok) {
                dispatch(setChats(res.data.chats));
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-slate-400">
            <div className={`absolute top-0 left-0 w-full h-40 ${backgroundColor} z-0`}></div>
            <div className="flex w-full h-full p-6 z-10">
                <div className="flex bg-white  dark:bg-slate-500 rounded-lg shadow-lg overflow-hidden w-full">
                    <div className={`relative light: bg-gray-50  dark:bg-slate-800 border-r transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-16'}`}>
                        <div className="p-4">
                            <h2 className={`text-xl font-semibold text-gray-800 dark:text-gray-200 ${isOpen ? '' : 'hidden'}`}>TaskPilot</h2>
                        </div>
                        <nav className="mt-4 flex flex-col justify-between h-[calc(100%-5rem)]">
                            <div>
                                {navigationItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleNavigation(item.path)}
                                        className={`flex items-center py-2 px-4 dark:text-gray-200 dark:hover:bg-gray-700  hover:bg-gray-200 w-full text-left ${location.pathname === item.path ? 'dark:bg-slate-500 bg-gray-200' : ''}`}
                                    >
                                        <span className="mr-2">{item.icon}</span>
                                        {isOpen && <span>{item.label}</span>}
                                    </button>
                                ))}
                            </div>
                            {token && <>
                                <button
                                    onClick={() => handleNavigation('/home/settings')}
                                    className={`flex items-center py-2 px-4 dark:text-gray-200 dark:hover:bg-gray-700  hover:bg-gray-200 w-full text-left ${location.pathname === '/home/settings' ? 'dark:bg-slate-500 bg-gray-200' : ''}`}
                                >
                                    <span className="mr-2">⚙️</span>
                                    {isOpen && <span>Settings</span>}
                                </button>
                            </>}
                        </nav>
                        <button
                            onClick={toggleSidebar}
                            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-1 shadow-md"
                        >
                            <div className={`w-3 h-3 border-t-2 border-r-2 border-gray-600 transform ${isOpen ? 'rotate-[225deg]' : 'rotate-45'} transition-transform duration-200`}></div>
                        </button>
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 p-8 overflow-auto">
                            <Routes>
                                <Route index element={<Dashboard />} />
                                <Route path="analytics" element={<Analytics />} />
                                <Route path="teams" element={<>
                                    {token ? <>
                                        <Suspense fallback={<div>Loading Micro Frontend...</div>}>
                                            <RemoteTeams chats={chats} createTeam={handleCreateTeam} token={token} />
                                        </Suspense>
                                    </> : <>
                                        <NotLogged />
                                    </>}
                                </>} />
                                <Route path="documents" element={<Documents />} />
                                <Route path="settings" element={<Settings />} />
                            </Routes>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Home;
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { setHandleAuth, setShowAuth } from '@/store/store';
import LogoIconSrc from '@/assets/TPLogo.svg';
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/Avatar";

const Navbar = () => {
    const { token, fullName, backgroundColor, ProfileImage } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    return (
        <nav className="sticky top-0 z-50 w-full bg-white/95 dark:bg-black/75 shadow-md">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center justify-start">
                        <img
                            src={LogoIconSrc}
                            alt="User"
                            className="w-14 h-14 cursor-pointer"
                        />
                        <Link to="/" className="text-blue-500 text-xl font-bold">
                            TaskPilot
                        </Link>
                    </div>
                    <div className="flex items-center">
                        {!token ? (
                            <Button
                                onClick={() => {
                                    dispatch(setShowAuth(true))
                                    dispatch(setHandleAuth(false))
                                }}
                                className="ml-4 p-4 bg-blue-500 hover:bg-blue-600 font-bold mr-3 dark:text-gray-200"
                            >
                                Sign in
                            </Button>
                        ) : (
                            <Avatar className="h-8 w-8 cursor-pointer dark:text-gray-200" onClick={() => navigate('/home/settings')}>
                                <AvatarImage src={ProfileImage} alt={fullName} />
                                <AvatarFallback className={`font-bold text-[16px] ${backgroundColor}`}>{fullName?.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
                            </Avatar>
                        )}
                    </div>
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

// Global top navigation controlling guest routing and authenticated entry points
export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 text-white bg-black/40 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                {}
                <div className="flex items-center gap-2 cursor-pointer">
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                        <img src={logo} alt="NexusPlay Logo" className="h-8 w-auto object-contain" />
                    </Link>
                </div>

                {}
                <div className="hidden md:flex items-center gap-12 text-sm text-gray-300">
                </div>

                {}
                <div className="flex items-center gap-3 md:gap-6">
                    {user ? (
                        <>
                            <span className="text-sm text-gray-400 hidden md:block">{user.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
                            >
                                Logout
                            </button>
                            <Link
                                to="/dashboard"
                                className="bg-brand-red hover:bg-[#FF4D4D] text-white text-sm font-medium py-2 px-4 md:px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(255,51,51,0.5)] cursor-pointer"
                            >
                                Dashboard
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-sm text-gray-300 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="bg-brand-red hover:bg-[#FF4D4D] text-white text-sm font-medium py-2 px-4 md:px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(255,51,51,0.5)]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}

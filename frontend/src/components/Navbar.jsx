import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="bg-black text-white border-b border-gray-900">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="NexusPlay Logo" className="h-8 w-auto object-contain" />
                    </Link>
                </div>

                {/* Enlaces centrales */}
                <div className="hidden md:flex items-center gap-12 text-sm text-gray-300">
                    <Link to="/dashboard/players" className="hover:text-white transition-colors">Find Players</Link>
                    <Link to="/dashboard/teams" className="hover:text-white transition-colors">Find Teams</Link>
                    <Link to="/dashboard/events" className="hover:text-white transition-colors">Events</Link>
                    <a href={import.meta.env.VITE_WP_URL || 'http://localhost/wordpress'} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">News</a>
                </div>

                {/* Botones de Auth — cambian según estado de sesión */}
                <div className="flex items-center gap-6">
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
                                className="bg-brand-red hover:bg-[#FF4D4D] text-white text-sm font-medium py-2 px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(255,51,51,0.5)] cursor-pointer"
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
                                className="bg-brand-red hover:bg-[#FF4D4D] text-white text-sm font-medium py-2 px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(255,51,51,0.5)]"
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

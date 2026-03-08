import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-black text-white border-b border-gray-900">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <Link to="/" className="flex items-center gap-2">
                        <div 
                            className="bg-brand-red text-white font-bold w-8 h-8 flex items-center justify-center rounded"
                        >
                            N
                        </div>
                        <span className="text-xl font-bold">
                            <span className="text-brand-red">Nexus</span>Play
                        </span>
                    </Link>
                </div>

                {/* Enlaces centrales */}
                <div className="hidden md:flex items-center gap-12 text-sm text-gray-300">
                    <a href="#" className="hover:text-white transition-colors">Find Players</a>
                    <Link to="/find-teams" className="hover:text-white transition-colors">Find Teams</Link>
                    <a href="#" className="hover:text-white transition-colors">Events</a>
                    <a href="#" className="hover:text-white transition-colors">News</a>
                </div>

                {/* Botones de Auth */}
                <div className="flex items-center gap-6">
                    {/* Enlace al Login */}
                    <Link 
                        to="/login" 
                        className="text-sm text-gray-300 hover:text-white transition-colors"
                    >
                        Login
                    </Link>
                    
                    {/* Enlace al Register (Corregido: ahora es un Link y apunta a /register) */}
                    <Link 
                        to="/Register" 
                        className="bg-brand-red hover:bg-[#FF4D4D] text-white text-sm font-medium py-2 px-6 rounded-md transition-colors shadow-[0_0_15px_rgba(255,51,51,0.5)]"
                    >
                        Register
                    </Link>
                </div>

            </div>
        </nav>
    );
}
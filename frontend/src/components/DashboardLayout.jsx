import {
    LayoutDashboard,
    Users,
    Shield,
    Calendar,
    MessageSquare,
    Bell,
    Settings,
    Search,
    ChevronDown,
    UserCircle,
    UserCog,
    LogOut
} from 'lucide-react';

import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function DashboardLayout() {
    // Extraemos los datos del usuario logueado y la funcion de cerrar sesion desde AuthContext
    const { user, logout } = useAuth();
    
    // Estado para controlar si el desplegable del perfil esta visible o no
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    
    // Guardo la ruta actual en una variable. 
    // Lo uso luego para saber en que pagina estoy y pintar ese boton de rojo.
    const location = useLocation();

    // En lugar de repetir el codigo del boton 7 veces, creo un array de objetos.
    // Asi el menu es escalable: si el dia de manana Mario o yo queremos anadir una seccion, 
    // solo hay que meter una linea nueva aqui y se pinta sola.
    const menuItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/dashboard/players', icon: <Users size={20} />, label: 'Find Players' },
        { path: '/dashboard/teams', icon: <Shield size={20} />, label: 'Find Teams' },
        { path: '/dashboard/events', icon: <Calendar size={20} />, label: 'Events' },
        // A algunos items les paso la propiedad 'badge' para mostrar el circulito rojo de notificaciones
        { path: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages', badge: 8 },
        { path: '/dashboard/notifications', icon: <Bell size={20} />, label: 'Notifications', badge: 3 },
        { path: '/dashboard/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
        { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    return (
        // Contenedor principal que ocupa toda la pantalla (min-h-screen)
        <div className="min-h-screen bg-[#0a0a0a] flex text-white font-sans">

            {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
            {/* Le pongo w-64 para dejarla fija y hidden md:flex para que se oculte en moviles */}
            <aside className="w-64 bg-[#121212] border-r border-gray-800 flex flex-col hidden md:flex">

                {/* Cabecera del Sidebar con el Logo */}
                <div className="h-20 flex items-center px-6 border-b border-gray-800">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="NexusPlay Logo" className="h-8 w-auto object-contain" />
                    </Link>
                </div>

                {/* Zona central del menu: iteramos sobre el array que creamos arriba */}
                <nav className="flex-1 py-6 px-4 space-y-2">
                    {menuItems.map((item, index) => {
                        // Comprobamos si la ruta del navegador coincide con la de este boton
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={index}
                                to={item.path}
                                // Si esta activo, le pongo fondo rojizo y texto rojo. Si no, gris.
                                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-brand-red/10 text-brand-red font-medium'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>

                                {/* Renderizado condicional: si el item tiene 'badge', pinto la pildora roja */}
                                {item.badge && (
                                    <span
                                        className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full"
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Zona inferior del menu: Tarjeta de perfil del usuario logueado */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-2">
                        {/* Avatar dinámico generado a partir de la primera letra del nombre */}
                        <div
                            className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red font-bold shrink-0 uppercase overflow-hidden"
                        >
                            {user?.avatar_url ? (
                                <img src={`http://localhost:8000${user.avatar_url}`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white line-clamp-1">{user?.name || 'User'}</p>
                            <p className="text-xs text-green-500">Online</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* ================= AREA PRINCIPAL DERECHA ================= */}
            {/* Uso flex-1 para que ocupe todo el ancho restante de la pantalla */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">

                {/* Barra superior de busqueda y utilidades */}
                <header
                    className="h-20 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-8 shrink-0 relative"
                >

                    {/* Input de busqueda con su icono metido dentro usando absolute */}
                    <div className="relative w-full max-w-md">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search players, teams, events..."
                            className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600"
                        />
                    </div>

                    {/* Controles de la derecha (Notificaciones y Perfil) */}
                    <div className="flex items-center gap-6">

                        {/* Campana de notificaciones con puntito rojo de aviso */}
                        <button className="text-gray-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span
                                className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full"
                            ></span>
                        </button>

                        {/* Contenedor relativo para poder posicionar el menu desplegable justo debajo */}
                        <div className="relative">
                            
                            {/* Boton del perfil que al hacer click cambia el estado abierto/cerrado */}
                            <div 
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2 cursor-pointer border-l border-gray-800 pl-6 hover:opacity-80 transition-opacity"
                            >
                                <div
                                    className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red font-bold text-sm uppercase overflow-hidden"
                                >
                                    {user?.avatar_url ? (
                                        <img src={`http://localhost:8000${user.avatar_url}`} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.name?.charAt(0) || 'U'
                                    )}
                                </div>
                                <ChevronDown 
                                    size={16} 
                                    className={`text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} 
                                />
                            </div>

                            {/* El menu desplegable. Solo se renderiza si isProfileMenuOpen es true */}
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-6 w-56 bg-[#121212] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                                    
                                    {/* Cabecera del desplegable con el correo */}
                                    <div className="p-4 border-b border-gray-800 bg-[#1a1a1a]">
                                        <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || 'user@nexusplay.com'}</p>
                                    </div>
                                    
                                    {/* Opciones del menu */}
                                    <div className="p-2 space-y-1">
                                        <Link 
                                            to="/dashboard/profile" 
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <UserCircle size={16} />
                                            Ver perfil
                                        </Link>
                                        <Link 
                                            to="/dashboard/profile-settings" 
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <UserCog size={16} />
                                            Ajustes de perfil
                                        </Link>
                                        <Link 
                                            to="/dashboard/settings" 
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <Settings size={16} />
                                            Ajustes
                                        </Link>
                                    </div>
                                    
                                    {/* Boton de Logout en rojo para destacar */}
                                    <div className="p-2 border-t border-gray-800">
                                        <button 
                                            onClick={() => {
                                                setIsProfileMenuOpen(false);
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors font-medium"
                                        >
                                            <LogOut size={16} />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* 
                    Este es el contenedor dinámico. El Outlet de React Router inyecta aqui 
                    el contenido de la ruta en la que estemos (ej: las estadisticas, la lista de jugadores, etc) 
                    sin tener que recargar ni el menu lateral ni la barra superior.
                */}
                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>

            </main>
        </div>
    );
}
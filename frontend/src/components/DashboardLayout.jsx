// Importamos todos los iconos que necesitamos para el menu lateral y la barra superior.
// Usar lucide-react nos asegura que todos los iconos mantengan el mismo grosor y estilo.
import {
    LayoutDashboard,
    Users,
    Shield,
    Calendar,
    MessageSquare,
    Bell,
    Settings,
    Search,
    ChevronDown
} from 'lucide-react';

import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function DashboardLayout() {
    // Extraemos los datos del usuario logueado en tiempo real desde AuthContext
    const { user } = useAuth();
    
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
                            className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red font-bold shrink-0 uppercase"
                        >
                            {user?.name?.charAt(0) || 'U'}
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
                    className="h-20 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-8 shrink-0"
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

                        {/* Desplegable del perfil con separador visual (border-l) */}
                        <div className="flex items-center gap-2 cursor-pointer border-l border-gray-800 pl-6">
                            <div
                                className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red font-bold text-sm uppercase"
                            >
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <ChevronDown size={16} className="text-gray-500" />
                        </div>
                    </div>
                </header>

                {/* EL CORAZON DEL DASHBOARD: 
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
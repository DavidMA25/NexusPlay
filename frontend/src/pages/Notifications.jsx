import { useState } from 'react';
import { Users, Trophy, Calendar, UserPlus, Star, MessageSquare, Check } from 'lucide-react';

export default function Notifications() {
    // Estado para el filtro activo
    const [activeFilter, setActiveFilter] = useState('All');

    const [notifications, setNotifications] = useState([
        {
            id: 1, type: 'Teams', read: false, hasActions: true,
            icon: Users, iconColor: 'text-blue-400', iconBg: 'bg-blue-400/10',
            hasAvatar: true, avatarBg: 'bg-[#FFB800]',
            text: 'Phoenix Squad invited you to join their team as Controller',
            time: '2 hours ago'
        },
        {
            id: 2, type: 'Events', read: false, hasActions: true,
            icon: Trophy, iconColor: 'text-brand-red', iconBg: 'bg-brand-red/10',
            hasAvatar: true, avatarBg: 'bg-[#FFB800]',
            text: 'Shadow wants to play a ranked match with you',
            time: '3 hours ago'
        },
        {
            id: 3, type: 'Events', read: false, hasActions: false,
            icon: Calendar, iconColor: 'text-yellow-500', iconBg: 'bg-yellow-500/10',
            hasAvatar: false,
            text: 'NexusPlay Summer Championship starts in 3 days',
            time: '5 hours ago'
        },
        {
            id: 4, type: 'All', read: true, hasActions: false, 
            icon: UserPlus, iconColor: 'text-green-500', iconBg: 'bg-green-500/10',
            hasAvatar: true, avatarBg: 'bg-gray-600',
            text: 'Viper started following your profile',
            time: '8 hours ago'
        },
        {
            id: 5, type: 'All', read: true, hasActions: false,
            icon: Star, iconColor: 'text-brand-red', iconBg: 'bg-brand-red/10',
            hasAvatar: false,
            text: 'You unlocked "MVP Master" - Get 50 MVP awards',
            time: '1 day ago'
        },
        {
            id: 6, type: 'Messages', read: true, hasActions: false,
            icon: MessageSquare, iconColor: 'text-purple-500', iconBg: 'bg-purple-500/10',
            hasAvatar: true, avatarBg: 'bg-[#FFB800]',
            text: 'Thunder sent you a message',
            time: '1 day ago'
        },
        {
            id: 7, type: 'Teams', read: true, hasActions: false,
            icon: Users, iconColor: 'text-blue-400', iconBg: 'bg-blue-400/10',
            hasAvatar: true, avatarBg: 'bg-[#FFB800]',
            text: 'Storm Riders invited you for a tryout',
            time: '2 days ago'
        },
        {
            id: 8, type: 'Events', read: true, hasActions: false,
            icon: Calendar, iconColor: 'text-yellow-500', iconBg: 'bg-yellow-500/10',
            hasAvatar: false,
            text: 'Weekly Showdown #41 results are in - you placed 3rd!',
            time: '3 days ago'
        },
        {
            id: 9, type: 'Teams', read: true, hasActions: false,
            icon: Trophy, iconColor: 'text-brand-red', iconBg: 'bg-brand-red/10',
            hasAvatar: true, avatarBg: 'bg-[#FFB800]',
            text: 'Dark Knights wants to scrim against your team',
            time: '3 days ago'
        },
        {
            id: 10, type: 'All', read: true, hasActions: false,
            icon: UserPlus, iconColor: 'text-green-500', iconBg: 'bg-green-500/10',
            hasAvatar: true, avatarBg: 'bg-purple-800',
            text: 'Ember started following your profile',
            time: '4 days ago'
        }
    ]);

    const filters = ['All', 'Unread', 'Teams', 'Events', 'Messages'];

    // Filtramos las notificaciones en base a la pastilla seleccionada
    const filteredNotifications = notifications.filter(notif => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Unread') return !notif.read;
        return notif.type === activeFilter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            
            {/* Header: Titulo y boton de marcar leidas */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Notifications</h1>
                    <p className="text-gray-400 text-sm mt-1">{unreadCount} unread notifications</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-700 hover:bg-gray-800 rounded-lg text-xs font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Check size={14} />
                    Mark all read
                </button>
            </div>

            {/* Filtros en forma de pastillas */}
            <div className="flex gap-2">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            activeFilter === filter 
                                ? 'bg-brand-red text-white' 
                                : 'bg-[#1a1a1a] border border-gray-800 text-gray-400 hover:text-white'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Listado de Notificaciones */}
            <div className="space-y-3">
                {filteredNotifications.map((notif) => {
                    const Icon = notif.icon;
                    return (
                        <div 
                            key={notif.id} 
                            className={`bg-[#0a0a0a] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border transition-colors ${
                                notif.read 
                                    ? 'border-gray-800 hover:border-gray-700' 
                                    : 'border-gray-800 border-l-4 border-l-brand-red bg-[#120a0a]'
                            }`}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {/* Iconito circular del tipo de notificacion */}
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${notif.iconBg}`}>
                                    <Icon size={14} className={notif.iconColor} />
                                </div>

                                {/* Avatar (si lo tiene) */}
                                {notif.hasAvatar && (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-800 ${notif.avatarBg}`}>
                                        <div className="w-4 h-1.5 bg-gray-900 rounded-full relative">
                                            <div className="absolute top-[1px] left-[2px] w-1 h-1 bg-current rounded-full text-[#FFB800]"></div>
                                            <div className="absolute top-[1px] right-[2px] w-1 h-1 bg-current rounded-full text-[#FFB800]"></div>
                                        </div>
                                    </div>
                                )}

                                {/* Texto principal */}
                                <div>
                                    <p className="text-sm font-medium text-gray-200">
                                        {notif.text}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {notif.time}
                                    </p>
                                </div>
                            </div>

                            {/* Botones de accion (Accept / Decline) */}
                            {notif.hasActions && !notif.read && (
                                <div className="flex items-center gap-2 ml-12 sm:ml-0">
                                    <button className="bg-brand-red hover:bg-[#ff4d4d] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors">
                                        Accept
                                    </button>
                                    <button className="bg-transparent border border-gray-700 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors">
                                        Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
                
                {filteredNotifications.length === 0 && (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        No notifications found for this filter.
                    </div>
                )}
            </div>
            
        </div>
    );
}
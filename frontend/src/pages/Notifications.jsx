import { useState } from 'react';
import { Users, Trophy, X, MessageSquare, Check, Shield, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';

// User inbox list tracking all interactions, mentions, and application statuses with action controls
export default function Notifications() {
    const { api } = useAuth();
    const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications();
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const filters = ['All', 'Unread', 'Team Applications', 'Matches'];

    const filteredNotifications = notifications.filter(notif => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Unread') return !notif.read;
        if (activeFilter === 'Team Applications') return notif.type === 'team_application';
        if (activeFilter === 'Matches') return ['ad_match', 'vacancy_match'].includes(notif.type);
        return true;
    });

    const handleAction = async (notif, status) => {
        try {
            await api.patch(`/applications/${notif.data.application_id}`, { status });
            markAsRead(notif.id);
        } catch (err) {
            console.error(err);
        }
    };

    const viewProfile = async (userId) => {
        try {
            const res = await api.get(`/players/${userId}`);
            const user = res.data;
            setSelectedPlayer({
                id:           user.id,
                username:     user.nickname || user.name,
                fullName:     user.name,
                avatarUrl:    user.avatar_url,
                bio:          user.bio || 'No biography provided.',
                location:     user.profile?.region || 'Global',
                language:     user.profile?.languages || 'Not specified',
                availability: user.profile?.availability_status || 'Available',
                stats:        user.stats || [],
                games: user.stats?.map(s => ({
                    name:      s.game_name || `Game #${s.game_igdb_id}`,
                    rank:      s.rank_tier || 'Unranked',
                    platform:  (s.platform || 'pc').toLowerCase(),
                    role:      s.role_main || 'Flex',
                    cover_url: s.cover_url || null,
                })) || [],
                roles: user.stats?.length > 0
                    ? [...new Set(user.stats.map(s => s.role_main || 'Flex'))]
                    : ['Flex'],
            });
        } catch (err) {
            console.error('Error fetching player profile:', err);
        }
    };

    const getIconInfo = (type) => {
        switch (type) {
            case 'team_application':     return { icon: Shield,       color: 'text-brand-red',  bg: 'bg-brand-red/10'  };
            case 'application_accepted': return { icon: Check,        color: 'text-green-500',  bg: 'bg-green-500/10'  };
            case 'application_rejected': return { icon: X,            color: 'text-red-500',    bg: 'bg-red-500/10'    };
            case 'new_message':          return { icon: MessageSquare, color: 'text-blue-400',   bg: 'bg-blue-400/10'   };
            case 'ad_match':             return { icon: Users,         color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
            case 'vacancy_match':        return { icon: Trophy,        color: 'text-brand-red',  bg: 'bg-brand-red/10'  };
            default:                     return { icon: Bell,          color: 'text-gray-400',   bg: 'bg-gray-400/10'   };
        }
    };

    const buildText = (notif) => {
        switch (notif.type) {
            case 'team_application':
                return `${notif.data.user_name} wants to join ${notif.data.team_name}: "${notif.data.message}"`;
            case 'application_accepted':
            case 'application_rejected':
                return notif.data.message;
            case 'new_message':
                return `New message from ${notif.data.sender_name}: "${notif.data.message_content}"`;
            case 'ad_match':
                return `${notif.data.creator_name} is looking for players in ${notif.data.game_name}: "${notif.data.message}"`;
            case 'vacancy_match':
                return `${notif.data.team_name} is looking for players in ${notif.data.game_name}: "${notif.data.description}"`;
            default:
                return 'New notification';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">

            {}
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

            {}
            <div className="flex gap-2 flex-wrap">
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

            {}
            <div className="space-y-3">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red" />
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        No notifications found for this filter.
                    </div>
                ) : filteredNotifications.map((notif) => {
                    const { icon: Icon, color, bg } = getIconInfo(notif.type);
                    const avatarSrc = null;

                    return (
                        <div
                            key={notif.id}
                            onClick={() => !notif.read && markAsRead(notif.id)}
                            className={`bg-[#0a0a0a] rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border transition-colors cursor-pointer ${
                                notif.read
                                    ? 'border-gray-800 hover:border-gray-700'
                                    : 'border-gray-800 border-l-4 border-l-brand-red bg-[#120a0a]'
                            }`}
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                {}
                                {avatarSrc ? (
                                    <div className={`w-8 h-8 rounded-full flex-shrink-0 overflow-hidden border border-gray-700 ${bg}`}>
                                        <img
                                            src={avatarSrc}
                                            alt={notif.data?.user_name ?? 'avatar'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement.classList.add(
                                                    'flex', 'items-center', 'justify-center'
                                                );
                                                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                                                svg.setAttribute('width', '14');
                                                svg.setAttribute('height', '14');
                                                svg.setAttribute('viewBox', '0 0 24 24');
                                                svg.setAttribute('fill', 'none');
                                                svg.setAttribute('stroke', 'currentColor');
                                                svg.setAttribute('stroke-width', '2');
                                                svg.classList.add('text-brand-red');
                                                svg.innerHTML = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>';
                                                e.currentTarget.parentElement.appendChild(svg);
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${bg}`}>
                                        <Icon size={14} className={color} />
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-200 leading-snug">
                                        {buildText(notif)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">{notif.created_at}</p>
                                </div>
                            </div>

                            {}
                            {notif.type === 'team_application' && !notif.read && (
                                <div className="flex items-center gap-2 ml-12 sm:ml-0 flex-shrink-0">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); viewProfile(notif.data.user_id); }}
                                        className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAction(notif, 'accepted'); }}
                                        className="bg-brand-red hover:bg-[#ff4d4d] text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAction(notif, 'rejected'); }}
                                        className="bg-transparent border border-gray-700 hover:bg-gray-800 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
                                    >
                                        Decline
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {}
            {selectedPlayer && (
                <div
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-10 px-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={(e) => { if (e.target === e.currentTarget) setSelectedPlayer(null); }}
                >
                    <div className="w-full max-w-2xl animate-[slideUp_0.3s_ease-out]">
                        <ProfileCard
                            playerData={selectedPlayer}
                            isOwnProfile={false}
                            onClose={() => setSelectedPlayer(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

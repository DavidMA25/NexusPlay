import {
    LayoutDashboard,
    Users,
    Shield,
    Calendar,
    MessageSquare,
    Bell,
    Settings,
    ChevronDown,
    UserCircle,
    UserCog,
    LogOut,
    Megaphone,
    X,
    Send,
    Menu
} from 'lucide-react';

import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useNotifications } from '../context/NotificationContext';
import logo from '../assets/logo.png';

export default function DashboardLayout() {
    const { user, logout, api } = useAuth();
    const { totalUnread } = useChat();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();

    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const [showAdModal, setShowAdModal] = useState(false);
    const [myStats, setMyStats] = useState([]);
    const [selectedStatId, setSelectedStatId] = useState('');
    const [adMessage, setAdMessage] = useState('');
    const [publishing, setPublishing] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [publishError, setPublishError] = useState('');

    const [showTeamAdModal, setShowTeamAdModal] = useState(false);
    const [myTeams, setMyTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState('');
    const [teamAdDesc, setTeamAdDesc] = useState('');
    const [teamAdRankMin, setTeamAdRankMin] = useState('');
    const [teamAdRankMax, setTeamAdRankMax] = useState('');
    const [publishingTeam, setPublishingTeam] = useState(false);
    const [teamPublishSuccess, setTeamPublishSuccess] = useState(false);
    const [teamPublishError, setTeamPublishError] = useState('');

    useEffect(() => {
        api.get('/player-stats').then(res => {
            setMyStats(res.data.data || res.data);
        }).catch(err => console.error('Error fetching stats:', err));

        api.get('/teams/my').then(res => {
            const teams = res.data.data || res.data;
            setMyTeams(teams.filter(t => t.is_admin));
        }).catch(err => console.error('Error fetching teams:', err));
    }, [api]);

    const handlePublishAd = async () => {
        if (!selectedStatId || !adMessage.trim()) return;
        setPublishing(true);
        setPublishError('');
        try {
            await api.post('/player-ads', {
                player_stat_id: parseInt(selectedStatId),
                message: adMessage.trim()
            });
            setPublishSuccess(true);
            setTimeout(() => {
                setShowAdModal(false);
                setSelectedStatId('');
                setAdMessage('');
                setPublishSuccess(false);
            }, 1500);
        } catch (err) {
            setPublishError(err.response?.data?.message || 'Error publishing ad.');
        } finally {
            setPublishing(false);
        }
    };

    const handlePublishTeamAd = async () => {
        if (!selectedTeamId || !teamAdDesc.trim()) return;
        setPublishingTeam(true);
        setTeamPublishError('');
        try {
            const team = myTeams.find(t => t.id === parseInt(selectedTeamId));
            await api.post('/vacancies', {
                team_id: parseInt(selectedTeamId),
                description: teamAdDesc.trim(),
                required_rank_min: teamAdRankMin || null,
                required_rank_max: teamAdRankMax || null,
                role_needed: 'Any',
                game_igdb_id: team?.game_igdb_id
            });
            setTeamPublishSuccess(true);
            setTimeout(() => {
                setShowTeamAdModal(false);
                setSelectedTeamId('');
                setTeamAdDesc('');
                setTeamAdRankMin('');
                setTeamAdRankMax('');
                setTeamPublishSuccess(false);
            }, 1500);
        } catch (err) {
            setTeamPublishError(err.response?.data?.message || 'Error publishing team ad.');
        } finally {
            setPublishingTeam(false);
        }
    };

    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/dashboard/players', icon: <Users size={20} />, label: 'Find Players' },
        { path: '/dashboard/teams', icon: <Shield size={20} />, label: 'Find Teams' },
        { path: '/dashboard/events', icon: <Calendar size={20} />, label: 'Events' },
        { path: '/dashboard/messages', icon: <MessageSquare size={20} />, label: 'Messages', badge: totalUnread || null },
        { path: '/dashboard/notifications', icon: <Bell size={20} />, label: 'Notifications', badge: unreadCount || null },
        { path: '/dashboard/profile', icon: <UserCircle size={20} />, label: 'My Profile' },
        { path: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="h-screen overflow-hidden bg-[#0a0a0a] flex text-white font-sans">

            {/* Overlay para cerrar el menú en móvil */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* ================= SIDEBAR ================= */}
            <aside className={`
                fixed md:relative z-40 h-full w-64
                bg-[#121212] border-r border-gray-800 flex flex-col
                transition-transform duration-300
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>

                <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-gray-800 shrink-0">
                    <Link to="/" className="flex items-center gap-2">
                        <img src={logo} alt="NexusPlay Logo" className="h-8 w-auto object-contain" />
                    </Link>
                    <button
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                        onClick={closeSidebar}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={index}
                                to={item.path}
                                onClick={closeSidebar}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-brand-red/10 text-brand-red font-medium'
                                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-brand-red text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-2 shrink-0">
                    <button
                        onClick={() => { setShowAdModal(true); closeSidebar(); }}
                        className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-4 py-3 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_20px_rgba(255,51,51,0.4)] whitespace-nowrap"
                    >
                        <Megaphone size={18} />
                        Publish Ad
                    </button>
                    {myTeams.length > 0 && (
                        <button
                            onClick={() => { setShowTeamAdModal(true); closeSidebar(); }}
                            className="w-full flex items-center justify-center gap-2 bg-[#1a1a1a] border border-gray-700 hover:bg-[#222] text-white px-4 py-3 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                        >
                            <Shield size={18} />
                            Publish Team Ad
                        </button>
                    )}
                </div>
            </aside>

            {/* ================= ÁREA PRINCIPAL ================= */}
            <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

                <header className="h-16 md:h-20 border-b border-gray-800 bg-[#0a0a0a] flex items-center justify-between px-4 md:px-8 shrink-0">

                    {/* Hamburguesa — solo en móvil */}
                    <button
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu size={22} />
                    </button>

                    <div className="hidden md:block" />

                    <div className="flex items-center gap-4 md:gap-6">

                        <button onClick={() => navigate('/dashboard/notifications')} className="text-gray-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-red rounded-full"></span>
                            )}
                        </button>

                        <div className="relative">
                            <div
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center gap-2 cursor-pointer border-l border-gray-800 pl-4 md:pl-6 hover:opacity-80 transition-opacity"
                            >
                                <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red font-bold text-sm uppercase overflow-hidden">
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

                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-6 w-56 bg-[#121212] border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                                    <div className="p-4 border-b border-gray-800 bg-[#1a1a1a]">
                                        <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email || 'user@nexusplay.com'}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link
                                            to="/dashboard/profile"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <UserCircle size={16} />
                                            View Profile
                                        </Link>
                                        <Link
                                            to="/dashboard/settings"
                                            onClick={() => setIsProfileMenuOpen(false)}
                                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <Settings size={16} />
                                            Settings
                                        </Link>
                                    </div>
                                    <div className="p-2 border-t border-gray-800">
                                        <button
                                            onClick={async () => {
                                                setIsProfileMenuOpen(false);
                                                await logout();
                                                navigate('/');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-brand-red hover:bg-brand-red/10 rounded-lg transition-colors font-medium cursor-pointer"
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

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <Outlet />
                </div>

            </main>

            {/* ===== MODAL: Publish Ad ===== */}
            {showAdModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowAdModal(false); }}
                >
                    <div className="w-full max-w-md bg-[#121212] border border-gray-800 rounded-xl shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
                                    <Megaphone size={20} className="text-brand-red" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Publish Ad</h3>
                                    <p className="text-gray-500 text-xs">Find players for your game</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAdModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">Select Game</label>
                                {myStats.length === 0 ? (
                                    <p className="text-gray-500 text-sm">You have no games added yet. Go to Profile Settings to add games.</p>
                                ) : (
                                    <select
                                        value={selectedStatId}
                                        onChange={(e) => setSelectedStatId(e.target.value)}
                                        className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-sm rounded-lg p-3 focus:border-brand-red outline-none transition-colors"
                                    >
                                        <option value="">Choose a game...</option>
                                        {myStats.map((stat) => (
                                            <option key={stat.id} value={stat.id}>
                                                {stat.game_name || `Game #${stat.game_igdb_id}`} — {stat.rank_tier} ({stat.platform || 'PC'})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">Short Message</label>
                                <textarea
                                    value={adMessage}
                                    onChange={(e) => setAdMessage(e.target.value)}
                                    maxLength={255}
                                    rows={3}
                                    placeholder="Looking for teammates for ranked grind tonight..."
                                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-sm rounded-lg p-3 focus:border-brand-red outline-none transition-colors resize-none placeholder-gray-600"
                                />
                                <p className="text-right text-gray-600 text-[10px] mt-1">{adMessage.length}/255</p>
                            </div>
                            {publishError && (
                                <p className="text-red-500 text-xs bg-red-500/10 rounded-lg px-3 py-2">{publishError}</p>
                            )}
                            {publishSuccess && (
                                <p className="text-green-500 text-xs bg-green-500/10 rounded-lg px-3 py-2">✓ Ad published successfully!</p>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-800">
                            <button
                                onClick={handlePublishAd}
                                disabled={!selectedStatId || !adMessage.trim() || publishing || publishSuccess}
                                className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-[#FF4D4D] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                            >
                                <Send size={16} />
                                {publishing ? 'Publishing...' : 'Publish Ad'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL: Publish Team Ad ===== */}
            {showTeamAdModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-[fadeIn_0.2s_ease-out]"
                    onClick={(e) => { if (e.target === e.currentTarget) setShowTeamAdModal(false); }}
                >
                    <div className="w-full max-w-md bg-[#121212] border border-gray-800 rounded-xl shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
                                    <Shield size={20} className="text-brand-red" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">Publish Team Ad</h3>
                                    <p className="text-gray-500 text-xs">Find players for your team</p>
                                </div>
                            </div>
                            <button onClick={() => setShowTeamAdModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">Select Team</label>
                                <select
                                    value={selectedTeamId}
                                    onChange={(e) => setSelectedTeamId(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-sm rounded-lg p-3 focus:border-brand-red outline-none transition-colors"
                                >
                                    <option value="">Choose a team...</option>
                                    {myTeams.map((team) => (
                                        <option key={team.id} value={team.id}>
                                            {team.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">What are you looking for?</label>
                                <textarea
                                    value={teamAdDesc}
                                    onChange={(e) => setTeamAdDesc(e.target.value)}
                                    rows={3}
                                    placeholder="We are looking for a dedicated entry fragger for tournaments..."
                                    className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-sm rounded-lg p-3 focus:border-brand-red outline-none transition-colors resize-none placeholder-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">Min Rank</label>
                                    <input type="text" value={teamAdRankMin} onChange={e => setTeamAdRankMin(e.target.value)} placeholder="e.g. Diamond"
                                        className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-sm rounded-lg p-3 focus:border-brand-red outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">Max Rank</label>
                                    <input type="text" value={teamAdRankMax} onChange={e => setTeamAdRankMax(e.target.value)} placeholder="e.g. Ascendant"
                                        className="w-full bg-[#0a0a0a] border border-gray-800 text-white text-sm rounded-lg p-3 focus:border-brand-red outline-none transition-colors" />
                                </div>
                            </div>
                            {teamPublishError && (
                                <p className="text-red-500 text-xs bg-red-500/10 rounded-lg px-3 py-2">{teamPublishError}</p>
                            )}
                            {teamPublishSuccess && (
                                <p className="text-green-500 text-xs bg-green-500/10 rounded-lg px-3 py-2">✓ Ad published successfully!</p>
                            )}
                        </div>
                        <div className="p-6 border-t border-gray-800">
                            <button
                                onClick={handlePublishTeamAd}
                                disabled={!selectedTeamId || !teamAdDesc.trim() || publishingTeam || teamPublishSuccess}
                                className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-[#FF4D4D] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                            >
                                <Send size={16} />
                                {publishingTeam ? 'Publishing...' : 'Publish Team Ad'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

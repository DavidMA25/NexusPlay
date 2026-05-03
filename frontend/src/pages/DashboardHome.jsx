import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { Bot, MapPin, Globe, MessageSquare, Bell, Users, Gamepad2, Shield, Heart, Trophy, Info } from 'lucide-react';
import pcIcon from '../assets/pc.svg';
import nintendoIcon from '../assets/nintendo.svg';
import xboxIcon from '../assets/xbox.svg';
import playstationIcon from '../assets/playstation.svg';
import mobileIcon from '../assets/mobile.svg';
import { useNavigate } from 'react-router-dom';

const platformIcons = {
  pc: pcIcon,
  nintendo: nintendoIcon,
  xbox: xboxIcon,
  playstation: playstationIcon,
  mobile: mobileIcon
};

const platformNames = {
  pc: "PC",
  playstation: "PlayStation",
  xbox: "Xbox",
  nintendo: "Nintendo",
  mobile: "Mobile"
};

const platformStyles = {
  pc: "bg-gray-700 text-white",
  playstation: "bg-[#003791] text-white",
  xbox: "bg-[#107C10] text-white",
  nintendo: "bg-[#E60012] text-white",
  mobile: "bg-[#007AFF] text-white"
};

export default function DashboardHome() {
  const { user, api } = useAuth();
  const { conversations, openConversation } = useChat();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);

  // === MOCK DATA FOR DEMONSTRATION ===
  const mockNotifications = [
    { id: 1, type: "like", text: "Alex liked your profile", time: "2 hours ago", read: false, icon: <Heart size={18} className="text-brand-red" /> },
    { id: 2, type: "tournament", text: "Weekly Showdown starting soon", time: "5 hours ago", read: false, icon: <Trophy size={18} className="text-yellow-500" /> },
    { id: 3, type: "system", text: "Welcome to NexusPlay Beta!", time: "1 day ago", read: true, icon: <Info size={18} className="text-blue-500" /> },
  ];

  const mockTeams = [
    {
      id: 1,
      name: "Phoenix Squad",
      gameName: "Valorant",
      gameRank: "Diamond",
      gamePlatform: "pc",
      roleNeeded: "Sentinel",
      members: 4,
      maxMembers: 5,
      message: "Looking for a serious Sentinel player for upcoming tournaments.",
      avatarBg: "bg-brand-red",
      location: "Europe",
      language: "English"
    },
    {
      id: 2,
      name: "Liquid Dragons",
      gameName: "League of Legends",
      gameRank: "Platinum",
      gamePlatform: "pc",
      roleNeeded: "Jungler",
      members: 3,
      maxMembers: 5,
      message: "Chill team playing evening ranked flex. Need a reliable Jungler.",
      avatarBg: "bg-[#003791]",
      location: "North America",
      language: "English"
    }
  ];
  // ===================================

  // Conversaciones reales: primero no leídas, luego por fecha
  const recentMessages = [...conversations]
    .sort((a, b) =>
      (b.unread_count ?? 0) - (a.unread_count ?? 0) ||
      new Date(b.last_message?.created_at ?? 0) - new Date(a.last_message?.created_at ?? 0)
    )
    .slice(0, 3);

  const handleOpenConversation = (conv) => {
    openConversation(conv.id);
    navigate('/dashboard/messages');
  };

  function formatMsgTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diff = Math.floor((now - d) / 86400000);
    if (diff === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff === 1) return 'Yesterday';
    return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  }

  useEffect(() => {
    const fetchAds = async () => {
      if (!user) return;
      try {
        setLoadingAds(true);
        const userGameIds = user.stats?.map(s => String(s.game_igdb_id)) || [];
        
        const response = await api.get('/player-ads');
        const allAds = response.data.data || [];
        
        const userRegion = user.profile?.region;
        const userLanguage = user.profile?.languages;

        const matchingAds = allAds.filter(ad => {
          const adGameId = String(ad.stat?.game_igdb_id);
          const adRegion = ad.user?.profile?.region;
          
          const isNotCurrentUser = ad.user_id !== user.id;
          const hasMatchingGame = userGameIds.includes(adGameId);
          const isMatchingRegion = userRegion ? adRegion === userRegion : true;

          return isNotCurrentUser && hasMatchingGame && isMatchingRegion;
        });

        // Prioritize ads that match the user's spoken language
        matchingAds.sort((a, b) => {
          const aLangMatch = (userLanguage && a.user?.profile?.languages === userLanguage) ? 1 : 0;
          const bLangMatch = (userLanguage && b.user?.profile?.languages === userLanguage) ? 1 : 0;
          return bLangMatch - aLangMatch;
        });

        setAds(matchingAds.slice(0, 3));
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoadingAds(false);
      }
    };
    
    fetchAds();
  }, [user, api]);

  const mapAdData = (ad) => {
    const adUser = ad.user;
    const profile = adUser?.profile;
    const stat = ad.stat;
    const platform = (stat?.platform || 'pc').toLowerCase();

    return {
      id: ad.id,
      userId: adUser?.id,
      username: adUser?.nickname || adUser?.name || 'Unknown',
      avatarUrl: adUser?.avatar_url,
      avatarBg: "bg-brand-red",
      location: profile?.region || "Global",
      language: profile?.languages || "Not specified",
      availability: profile?.availability_status || "Available",
      message: ad.message,
      gameName: stat?.game_name || `Game #${stat?.game_igdb_id}`,
      gameRank: stat?.rank_tier || "Unranked",
      gamePlatform: platform,
      gameRole: stat?.role_main || "Flex",
    };
  };

  return (
    <div className="flex flex-col h-[calc(95vh-120px)] min-h-[500px]">
      {/* Welcome Header */}
      <div className="shrink-0 mb-4">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-brand-red">{user?.name || 'User'}</span>!
        </h1>
        <p className="text-gray-400 text-sm">
          Here's a quick overview of what's happening.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 min-h-0 grid-rows-2">
        
        {/* Ads Section (Spans 2 columns, Row 1) */}
        <div className="md:col-span-2 bg-[#121212] border border-gray-800 rounded-xl p-4 flex flex-col transition-all hover:border-gray-700 min-h-0">
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <div className="p-2 bg-brand-red/10 rounded-lg">
              <Gamepad2 size={20} className="text-brand-red" />
            </div>
            <h2 className="text-lg font-bold text-white">Ads You Might Like</h2>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            {loadingAds ? (
              <div className="flex-1 h-full flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-red"></div>
              </div>
            ) : ads.length === 0 ? (
              <div className="flex-1 h-full flex flex-col justify-center items-center text-center">
                <Bot size={32} className="text-gray-600 mb-2" />
                <h3 className="text-gray-400 font-medium text-sm">No matching ads found</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                {ads.map((ad) => {
                  const player = mapAdData(ad);
                  return (
                    <div
                      key={player.id}
                      className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex flex-col items-center text-center transition-all hover:border-brand-red/50 hover:shadow-[0_0_10px_rgba(255,51,51,0.1)] h-max"
                    >
                      <div className="flex items-center gap-3 w-full shrink-0">
                        <div className="relative shrink-0">
                          {player.avatarUrl ? (
                            <img src={player.avatarUrl.startsWith('http') ? player.avatarUrl : `http://localhost:8000${player.avatarUrl}`} alt={player.username} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${player.avatarBg}`}>
                              <Bot size={24} className="text-[#121212]" />
                            </div>
                          )}
                          <div className={`absolute bottom-0 right-0 w-3 h-3 border-[1.5px] border-[#1a1a1a] rounded-full ${player.availability === 'Available' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        </div>
                        <div className="flex-1 text-left overflow-hidden">
                          <h3 className="text-sm font-bold text-white truncate">{player.username}</h3>
                          <p className="text-xs text-gray-400 truncate">{player.gameRole}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap justify-center items-center gap-1.5 mt-3 shrink-0">
                        <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">
                          {player.gameName}
                        </span>
                        <span className="text-[10px] font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded">
                          {player.gameRank}
                        </span>
                      </div>

                      <div className="w-full mt-3 pt-3 border-t border-gray-800 flex-1 flex items-center justify-center min-h-0">
                        <p className="text-xs text-gray-300 italic line-clamp-2">"{player.message}"</p>
                      </div>

                      <div className="w-full mt-3 shrink-0">
                        <button onClick={() => navigate('/find-players')} className="w-full bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white text-xs font-medium py-1.5 rounded transition-all">
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Notifications Section (Col 3, Row 1) */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 flex flex-col transition-all hover:border-gray-700 min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-red/10 rounded-lg">
                <Bell size={20} className="text-brand-red" />
              </div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
            </div>
            <button className="text-xs text-brand-red hover:text-white transition-colors">Mark read</button>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar space-y-2">
            {mockNotifications.map(notification => (
              <div key={notification.id} className={`flex items-start gap-3 p-2 rounded-lg border ${notification.read ? 'bg-[#1a1a1a] border-transparent' : 'bg-[#1e1a1a] border-brand-red/20'}`}>
                <div className="mt-0.5 shrink-0">
                  {notification.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notification.read ? 'text-gray-300' : 'text-white font-medium'} truncate`}>{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
                {!notification.read && <div className="w-2 h-2 rounded-full bg-brand-red shrink-0 mt-1"></div>}
              </div>
            ))}
          </div>
        </div>

        {/* Teams Section (Spans 2 columns, Row 2) */}
        <div className="md:col-span-2 bg-[#121212] border border-gray-800 rounded-xl p-4 flex flex-col transition-all hover:border-gray-700 min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-red/10 rounded-lg">
                <Users size={20} className="text-brand-red" />
              </div>
              <h2 className="text-lg font-bold text-white">Teams You Might Like</h2>
            </div>
            <button onClick={() => navigate('/find-teams')} className="text-xs text-gray-400 hover:text-white transition-colors">View All</button>
          </div>
          
          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
              {mockTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center transition-all hover:border-brand-red/50 hover:shadow-[0_0_10px_rgba(255,51,51,0.1)] h-full"
                >
                  <div className="flex items-center gap-3 w-full shrink-0">
                    <div className="relative shrink-0">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${team.avatarBg}`}>
                        <Shield size={28} className="text-white" />
                      </div>
                    </div>
                    <div className="flex-1 text-left overflow-hidden">
                      <h3 className="text-base font-bold text-white truncate">{team.name}</h3>
                      <p className="text-sm text-gray-400 truncate">Members: {team.members}/{team.maxMembers}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center items-center gap-2 mt-4 shrink-0">
                    <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-2.5 py-1 rounded">
                      {team.gameName}
                    </span>
                    <span className="text-xs font-bold text-gray-300 bg-gray-800 px-2.5 py-1 rounded">
                      {team.gameRank}
                    </span>
                  </div>

                  <div className="w-full mt-4 pt-4 border-t border-gray-800 flex-1 flex items-center justify-center min-h-0">
                    <p className="text-xs text-gray-300 italic line-clamp-2">"{team.message}"</p>
                  </div>

                  <div className="w-full mt-3 shrink-0">
                    <button onClick={() => navigate('/find-teams')} className="w-full bg-transparent border border-gray-700 hover:border-gray-500 text-white text-xs font-medium py-1.5 rounded transition-colors">
                      View Team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Section (Col 3, Row 2) */}
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 flex flex-col transition-all hover:border-gray-700 min-h-0">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-brand-red/10 rounded-lg">
                <MessageSquare size={20} className="text-brand-red" />
              </div>
              <h2 className="text-lg font-bold text-white">New Messages</h2>
            </div>
            <button onClick={() => navigate('/dashboard/messages')} className="text-xs text-gray-400 hover:text-white transition-colors">Inbox</button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto pr-1 custom-scrollbar space-y-2">
            {recentMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-1 py-4">
                <MessageSquare size={20} className="opacity-30" />
                <p className="text-xs">Sin mensajes recientes</p>
              </div>
            ) : recentMessages.map(conv => {
              const initial = (conv.name ?? '?').charAt(0).toUpperCase();
              const base = 'http://localhost:8000';
              return (
                <div
                  key={conv.id}
                  onClick={() => handleOpenConversation(conv)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center shrink-0 overflow-hidden font-bold text-brand-red text-sm">
                    {conv.avatar_url
                      ? <img src={`${base}${conv.avatar_url}`} alt={conv.name} className="w-full h-full object-cover" />
                      : initial
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-white truncate">{conv.name}</h4>
                      <span className="text-[10px] text-gray-500">{formatMsgTime(conv.last_message?.created_at)}</span>
                    </div>
                    <p className={`text-xs truncate ${conv.unread_count > 0 ? 'text-gray-300 font-medium' : 'text-gray-500'}`}>
                      {conv.last_message?.content || 'Sin mensajes'}
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-white">{conv.unread_count > 9 ? '9+' : conv.unread_count}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="shrink-0 pt-3">
            <button
              onClick={() => navigate('/dashboard/messages')}
              className="w-full bg-[#1a1a1a] hover:bg-gray-800 text-white text-xs font-medium py-2 rounded transition-colors border border-gray-800"
            >
              Open Chat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
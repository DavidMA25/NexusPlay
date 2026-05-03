import { useState, useEffect } from 'react';
import { Search, Filter, Bot, MapPin, Globe, MessageSquare, X, ChevronLeft, ChevronRight } from 'lucide-react';
import pcIcon from '../assets/pc.svg';
import nintendoIcon from '../assets/nintendo.svg';
import xboxIcon from '../assets/xbox.svg';
import playstationIcon from '../assets/playstation.svg';
import mobileIcon from '../assets/mobile.svg';
import ProfileCard from '../components/ProfileCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';

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

export default function FindPlayers() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { api, user } = useAuth();
  const { addOrUpdateConversation, openConversation } = useChat();
  const navigate = useNavigate();

  const handleMessage = async (userId) => {
    try {
      const res = await api.post('/conversations/direct', { user_id: userId });
      addOrUpdateConversation(res.data);
      openConversation(res.data.id);
      navigate('/dashboard/messages');
    } catch (e) {
      console.error('Error abriendo conversación:', e);
    }
  };

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    region: '',
    rank: '',
    game: ''
  });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        ...(searchQuery && { search: searchQuery }),
        ...(filters.region && { region: filters.region }),
        ...(filters.rank && { rank: filters.rank }),
        ...(filters.game && { game: filters.game }),
      };

      const response = await api.get('/player-ads', { params });
      setAds(response.data.data);
      setTotalPages(response.data.last_page);
    } catch (error) {
      console.error('Error fetching player ads:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAds();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [page, searchQuery, filters]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ region: '', rank: '', game: '' });
    setPage(1);
  };

  // Map a player ad to view-friendly data
  const mapAdData = (ad) => {
    const user = ad.user;
    const profile = user?.profile;
    const stat = ad.stat;
    const platform = (stat?.platform || 'pc').toLowerCase();

    return {
      id: ad.id,
      userId: user?.id,
      username: user?.nickname || user?.name || 'Unknown',
      fullName: user?.name,
      avatarUrl: user?.avatar_url,
      avatarBg: "bg-brand-red",
      location: profile?.region || "Global",
      language: profile?.languages || "Not specified",
      availability: profile?.availability_status || "Available",
      // Ad-specific data
      message: ad.message,
      gameName: stat?.game_name || `Game #${stat?.game_igdb_id}`,
      gameRank: stat?.rank_tier || "Unranked",
      gamePlatform: platform,
      gameRole: stat?.role_main || "Flex",
      // Full data for profile modal
      bio: user?.bio || "No biography provided.",
      games: user?.stats?.length > 0
        ? user.stats.map(s => ({
          name: s.game_name || `Game #${s.game_igdb_id}`,
          rank: s.rank_tier || "Unranked",
          platform: (s.platform || 'pc').toLowerCase(),
          role: s.role_main || 'Flex',
          cover_url: s.cover_url || null
        }))
        : [],
      stats: user?.stats || [],
    };
  };

  // Build a profile-compatible object for the ProfileCard modal
  const buildProfileData = (ad) => {
    const data = mapAdData(ad);
    return {
      id: data.userId,
      username: data.username,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl,
      bio: data.bio,
      location: data.location,
      language: data.language,
      availability: data.availability,
      games: data.games,
      stats: data.stats,
      roles: data.games.length > 0 ? [...new Set(data.games.map(g => g.role))] : ["Flex"],
    };
  };

  return (
    <div className="space-y-8 pb-10">

      {/* 1. Cabecera */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Find Players</h1>
        <p className="text-gray-400 text-sm">
          Browse player ads and find teammates for your next game.
        </p>
      </div>

      {/* 2. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by player name..."
            className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-500"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 bg-[#121212] border border-gray-800 hover:border-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors h-full w-full md:w-auto"
          >
            <Filter size={18} />
            Filters {Object.values(filters).some(x => x) && <span className="w-2 h-2 rounded-full bg-brand-red"></span>}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-full md:w-72 bg-[#1a1a1a] border border-gray-800 rounded-lg p-5 z-20 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Filters</h3>
                <button onClick={clearFilters} className="text-xs text-brand-red hover:text-white transition-colors">Clear All</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Region</label>
                  <select name="region" value={filters.region} onChange={handleFilterChange} className="w-full bg-[#121212] border border-gray-800 text-white text-sm rounded-lg p-2 focus:border-brand-red outline-none">
                    <option value="">Any Region</option>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="South America">South America</option>
                    <option value="Oceania">Oceania</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Game</label>
                  <input type="text" name="game" value={filters.game} onChange={handleFilterChange} placeholder="e.g. Valorant" className="w-full bg-[#121212] border border-gray-800 text-white text-sm rounded-lg p-2 focus:border-brand-red outline-none" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Rank</label>
                  <input type="text" name="rank" value={filters.rank} onChange={handleFilterChange} placeholder="e.g. Diamond" className="w-full bg-[#121212] border border-gray-800 text-white text-sm rounded-lg p-2 focus:border-brand-red outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Grid de Anuncios */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-red"></div>
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-xl border border-gray-800">
          <Bot size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg">No ads found</h3>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query.</p>
          {(searchQuery || Object.values(filters).some(x => x)) && (
            <button onClick={clearFilters} className="mt-4 text-brand-red hover:underline text-sm">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ads.map((ad) => {
            const player = mapAdData(ad);
            return (
              <div
                key={player.id}
                className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-brand-red hover:shadow-[0_0_15px_rgba(255,51,51,0.15)] hover:-translate-y-1"
              >

                {/* Avatar con indicador de estado */}
                <div className="relative mb-4">
                  {player.avatarUrl ? (
                    <img src={player.avatarUrl.startsWith('http') ? player.avatarUrl : `http://localhost:8000${player.avatarUrl}`} alt={player.username} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${player.avatarBg}`}>
                      <Bot size={32} className="text-[#121212]" />
                    </div>
                  )}
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-[#121212] rounded-full ${player.availability === 'Available' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>

                {/* Nombres */}
                <h3 className="text-lg font-bold text-white leading-tight">{player.username}</h3>
                <p className="text-xs text-gray-400 mt-1">{player.fullName || ''}</p>

                {/* Etiqueta de Juego, Rango y Plataforma */}
                <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                  <div className="flex items-center gap-1.5 w-full justify-center">
                    <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">
                      {player.gameName}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded">
                      {player.gameRank}
                    </span>
                    {player.gamePlatform && platformIcons[player.gamePlatform] && (
                      <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded ${platformStyles[player.gamePlatform] || 'bg-gray-800 text-gray-300'}`}>
                        <img
                          src={platformIcons[player.gamePlatform]}
                          alt={player.gamePlatform}
                          className={`${player.gamePlatform === 'mobile' ? 'w-4 h-4' : 'w-3 h-3'} brightness-0 invert`}
                        />
                        {platformNames[player.gamePlatform] || player.gamePlatform}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rol */}
                <div className="flex gap-2 mt-3 text-xs text-gray-400">
                  <span>{player.gameRole}</span>
                </div>

                {/* Mensaje Corto (sustituye Win Rate / Hours) */}
                <div className="w-full mt-6 pt-6 border-t border-gray-800">
                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 italic">"{player.message}"</p>
                </div>

                {/* Ubicación + Idioma */}
                <div className="flex items-center justify-center gap-3 mt-4 text-gray-400 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} />
                    <span>{player.location}</span>
                  </div>
                  <span className="text-gray-700">•</span>
                  <div className="flex items-center gap-1">
                    <Globe size={12} />
                    <span>{player.language}</span>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="w-full flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedPlayer(buildProfileData(ad))}
                    className="flex-1 bg-transparent border border-gray-700 hover:border-gray-500 text-white text-xs font-medium py-2 rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                  {player.userId !== user?.id && (
                    <button
                      onClick={() => handleMessage(player.userId)}
                      className="flex-1 bg-brand-red hover:bg-[#FF4D4D] text-white text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                    >
                      <MessageSquare size={14} />
                      Message
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-[#121212] border border-gray-800 text-white disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-gray-400 text-sm">
            Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span>
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-lg bg-[#121212] border border-gray-800 text-white disabled:opacity-50 hover:bg-gray-800 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* ===== MODAL / OVERLAY DE PERFIL ===== */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-10 px-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedPlayer(null);
          }}
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
import { useState, useEffect } from "react";
import { Search, Filter, Bot, Users, ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function FindTeams() {
  const { api } = useAuth();
  const navigate = useNavigate();

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ region: '', game: '', rank: '' });

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = {
        page: page,
        ...(searchQuery && { search: searchQuery }),
        ...(filters.region && { region: filters.region }),
        ...(filters.game && { game: filters.game }),
        ...(filters.rank && { rank: filters.rank }),
      };

      const response = await api.get('/vacancies', { params });
      setAds(response.data.data);
      setTotalPages(response.data.meta?.last_page || response.data.last_page || 1);
    } catch (error) {
      console.error('Error fetching team vacancies:', error);
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ region: '', game: '', rank: '' });
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const getGameName = (id) => {
    const games = {
      1: 'LEAGUE OF LEGENDS',
      2: 'VALORANT',
      3: 'CS2',
      4: 'ROCKET LEAGUE'
    };
    return games[id] || 'GAME';
  };

  return (
    <div className="space-y-8 pb-10">

      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Find Teams</h1>
        <p className="text-gray-400 text-sm">
          Discover teams looking for players like you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search teams by name or game..."
            className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-500"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 bg-[#121212] border border-gray-800 hover:border-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors h-full w-full"
          >
            <Filter size={18} />
            Filters {Object.values(filters).some(x => x) && <span className="w-2 h-2 rounded-full bg-brand-red"></span>}
          </button>

          {showFilters && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#1a1a1a] border border-gray-800 rounded-lg p-5 z-20 shadow-2xl">
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
                  <label className="text-xs text-gray-400 mb-1 block">Min Rank</label>
                  <input type="text" name="rank" value={filters.rank} onChange={handleFilterChange} placeholder="e.g. Diamond" className="w-full bg-[#121212] border border-gray-800 text-white text-sm rounded-lg p-2 focus:border-brand-red outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-red"></div>
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20 bg-[#121212] rounded-xl border border-gray-800">
          <Bot size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-medium text-lg">No ads found</h3>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad, index) => (
            <div
              key={ad.id || index}
              className="bg-[#1A1A1A] rounded-r-xl rounded-l-md p-5 flex flex-col transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,51,51,0.05)] relative"
              style={{ borderLeft: "3px solid #FF4D4D" }}
            >

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center border border-gray-800 overflow-hidden">
                    {ad.team?.logo_url ? (
                      <img src={ad.team.logo_url} alt={ad.team?.name} className="w-full h-full object-cover" />
                    ) : (
                      <Bot size={24} className="text-blue-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white leading-tight">{ad.title || ad.team?.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">Active Recruitment</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[10px] font-bold text-teal-400 bg-teal-400/10 border border-teal-400/20 px-3 py-1 rounded-md flex items-center gap-1.5">
                  🕹️ {getGameName(ad.game_igdb_id)}
                </span>
                <span className="text-[10px] font-bold text-gray-300 bg-[#121212] border border-gray-800 px-3 py-1 rounded-md uppercase">
                  {ad.team?.region || 'EUROPE WEST'}
                </span>
                <span className="text-[10px] font-bold text-gray-300 bg-[#121212] border border-gray-800 px-3 py-1 rounded-md uppercase">
                  {ad.team?.language || 'ENGLISH'}
                </span>
              </div>

              <div className="mt-3">
                <p className="text-gray-400 text-sm italic">
                  "{ad.description}"
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4 pt-4 border-t border-gray-800/50">
                <div className="flex gap-8">
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">MIN LEVEL</p>
                    <p className="text-white font-bold text-sm">{ad.rank_min} <span className="font-normal text-gray-400">{ad.rank_max ? `- ${ad.rank_max}` : ''}</span></p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">MEMBERS</p>
                    <p className="text-white font-bold text-sm">{ad.team?.member_count || 4} / {ad.team?.max_members || 5}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">POSTED</p>
                    <p className="text-white font-bold text-sm">{ad.created_at || '2h ago'}</p>
                  </div>
                </div>
                <div>
                  <button onClick={() => navigate('/dashboard/team-profile')} className="bg-brand-red hover:bg-[#FF4D4D] text-black font-bold px-6 py-2 text-sm rounded-lg transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]">
                    Apply to Join
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

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

    </div>
  );
}
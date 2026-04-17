import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Eye,
  MessageSquare,
  Gamepad2,
  UserPlus,
  Trophy,
  Calendar,
  TrendingUp,
  ArrowRight,
  Megaphone,
  X,
  Send
} from 'lucide-react';

export default function DashboardHome() {
  const { user, api } = useAuth();
  const [showAdModal, setShowAdModal] = useState(false);
  const [myStats, setMyStats] = useState([]);
  const [selectedStatId, setSelectedStatId] = useState('');
  const [adMessage, setAdMessage] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishError, setPublishError] = useState('');

  // Fetch user's player stats when modal opens
  useEffect(() => {
    if (showAdModal) {
      api.get('/player-stats').then(res => {
        setMyStats(res.data.data || res.data);
      }).catch(err => console.error('Error fetching stats:', err));
    }
  }, [showAdModal]);

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

  // 1. Array de Estadísticas
  const stats = [
    { title: "Profile Views", value: "1,247", increase: "+12%", icon: <Eye size={20} className="text-brand-red" /> },
    { title: "New Messages", value: "8", increase: "+3", icon: <MessageSquare size={20} className="text-brand-red" /> },
    { title: "Match Invites", value: "5", increase: "+2", icon: <Gamepad2 size={20} className="text-brand-red" /> },
    { title: "Team Requests", value: "3", increase: "+1", icon: <UserPlus size={20} className="text-brand-red" /> }
  ];

  // 2. Array de Actividad Reciente
  const activities = [
    {
      title: "New match found",
      desc: "Shadow matched with your profile",
      time: "2 hours ago",
      btnText: "View Profile",
      icon: <Gamepad2 size={18} className="text-brand-red" />
    },
    {
      title: "Team Invitation",
      desc: "Phoenix Squad invited you to join",
      time: "5 hours ago",
      btnText: "View Team",
      icon: <Trophy size={18} className="text-brand-red" />
    },
    {
      title: "Event Starting Soon",
      desc: "Summer Championship starts in 3 days",
      time: "1 day ago",
      btnText: "Register Now",
      icon: <Calendar size={18} className="text-brand-red" />
    },
    {
      title: "Rank Update",
      desc: "You ranked up to Immortal 2!",
      time: "2 days ago",
      btnText: "View Stats",
      icon: <TrendingUp size={18} className="text-brand-red" />
    }
  ];

  // 3. Array de Usuarios Recomendados
  const recommended = [
    { name: "Shadow", game: "Valorant · Immortal", initial: "S" },
    { name: "Viper", game: "Valorant · Radiant", initial: "V" },
    { name: "Thunder", game: "CS2 · Global Elite", initial: "T" }
  ];

  // 4. Array de Eventos Próximos
  const events = [
    { name: "NexusPlay Summer Championship", date: "15/3/2026" },
    { name: "Weekly Showdown #42", date: "14/2/2026" },
    { name: "LoL Draft Kings Cup", date: "1/3/2026" }
  ];

  return (
    <div className="space-y-8">

      {/* Cabecera de bienvenida + Botón Publish Ad */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-brand-red">{user?.name || 'User'}</span>!
          </h1>
          <p className="text-gray-400 text-sm">
            Here's what's happening with your eSports career.
          </p>
        </div>
        <button
          onClick={() => setShowAdModal(true)}
          className="flex items-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_20px_rgba(255,51,51,0.4)] whitespace-nowrap"
        >
          <Megaphone size={18} />
          Publish Ad
        </button>
      </div>

      {/* Grid de Tarjetas Superiores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-[#121212] border border-gray-800 rounded-xl p-6 transition-all hover:border-gray-700 hover:shadow-lg hover:shadow-brand-red/5"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-brand-red/10 flex items-center justify-center">
                {stat.icon}
              </div>
              <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
                {stat.increase}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-400 font-medium">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Layout Inferior: Actividad y Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLUMNA IZQUIERDA: Recent Activity */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {activities.map((item, index) => (
              <div
                key={index}
                className="bg-[#121212] border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{item.title}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                    <p className="text-gray-500 text-[10px] mt-1.5">{item.time}</p>
                  </div>
                </div>

                <button
                  className="flex items-center justify-center gap-2 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.1)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)] whitespace-nowrap"
                >
                  {item.btnText} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Recommended & Events */}
        <div className="space-y-6">

          {/* Tarjeta: Recommended For You */}
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
            <h2 className="text-white font-bold text-sm mb-4">Recommended For You</h2>
            <div className="space-y-5">
              {recommended.map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red flex items-center justify-center text-brand-red font-bold text-xs shrink-0">
                    {user.initial}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.name}</p>
                    <p className="text-gray-400 text-xs">{user.game}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta: Upcoming Events */}
          <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
            <h2 className="text-white font-bold text-sm mb-4">Upcoming Events</h2>
            <div className="space-y-5">
              {events.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Calendar size={16} className="text-brand-red shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium leading-tight">{event.name}</p>
                    <p className="text-gray-500 text-xs mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ===== MODAL: Publish Ad ===== */}
      {showAdModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAdModal(false); }}
        >
          <div className="w-full max-w-md bg-[#121212] border border-gray-800 rounded-xl shadow-2xl animate-[slideUp_0.3s_ease-out] overflow-hidden">

            {/* Header */}
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

            {/* Body */}
            <div className="p-6 space-y-5">

              {/* Game Select */}
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

              {/* Message */}
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

              {/* Error */}
              {publishError && (
                <p className="text-red-500 text-xs bg-red-500/10 rounded-lg px-3 py-2">{publishError}</p>
              )}

              {/* Success */}
              {publishSuccess && (
                <p className="text-green-500 text-xs bg-green-500/10 rounded-lg px-3 py-2">✓ Ad published successfully!</p>
              )}
            </div>

            {/* Footer */}
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

    </div>
  );
}
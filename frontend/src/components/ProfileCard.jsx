import { MapPin, Globe, Calendar, Shield, Gamepad2, MessageSquare, Settings, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import pcIcon from '../assets/pc.svg';
import nintendoIcon from '../assets/nintendo.svg';
import xboxIcon from '../assets/xbox.svg';
import playstationIcon from '../assets/playstation.svg';
import mobileIcon from '../assets/mobile.svg';

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

const roleColors = {
  player: "text-brand-red bg-brand-red/10",
  recruiter: "text-blue-400 bg-blue-400/10",
  admin: "text-yellow-400 bg-yellow-400/10"
};

/**
 * ProfileCard — Componente reutilizable para mostrar el perfil completo de un jugador.
 * 
 * Props:
 *   - playerData: objeto con los datos del jugador
 *   - isOwnProfile: boolean que determina si es tu perfil o el de otro jugador
 *   - onClose: funcion para cerrar el modal (solo se usa cuando se invoca desde FindPlayers)
 */
export default function ProfileCard({ playerData, isOwnProfile = false, onClose = null }) {
    const navigate = useNavigate();
    const { api, user: authUser } = useAuth();
    const { addOrUpdateConversation, openConversation } = useChat();

    // Nunca permitir enviarse mensajes a uno mismo, aunque isOwnProfile llegue mal
    const isSelf = isOwnProfile || (authUser?.id && playerData?.id && authUser.id === playerData.id);

    const handleMessage = async () => {
        if (!playerData?.id || isSelf) return;
        try {
            const res = await api.post('/conversations/direct', { user_id: playerData.id });
            addOrUpdateConversation(res.data);
            openConversation(res.data.id);
            navigate('/dashboard/messages');
        } catch (e) {
            console.error('Error abriendo conversación:', e);
        }
    };

  // Datos del usuario (se adaptan tanto al formato del AuthContext como al mock de FindPlayers)
  const username = playerData?.name || playerData?.username || 'Unknown';
  const fullName = playerData?.fullName || playerData?.nickname || null;
  const email = playerData?.email || null;
  const bio = playerData?.bio || 'No biography provided yet.';
  const role = playerData?.role || 'player';
  const avatarUrl = playerData?.avatarUrl || playerData?.avatar_url || null;
  const region = playerData?.profile?.region || playerData?.location || 'Not specified';
  const language = playerData?.profile?.languages || playerData?.language || 'Not specified';
  const availability = playerData?.profile?.availability_status || playerData?.availability || 'Available';
  const memberSince = playerData?.created_at 
    ? new Date(playerData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : 'Member';

  // Juegos (del mock de FindPlayers o de los stats reales)
  let games = [];
  if (playerData?.stats?.length > 0) {
      games = playerData.stats.map(stat => ({
          game: stat.game_name || `Game #${stat.game_igdb_id}`,
          cover_url: stat.cover_url || null,
          rank: stat.rank_tier,
          platform: stat.platform || 'PC',
          roles: stat.role_main ? [stat.role_main] : []
      }));
  } else if (playerData?.games) {
      games = playerData.games;
  } else if (playerData?.game) {
      games = [{
        game: playerData.game,
        rank: playerData.rank,
        platform: playerData.platform,
        roles: playerData.roles || []
      }];
  }

  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* ===== HERO / CABECERA DEL PERFIL ===== */}
      <div className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden">
        
        {/* Banner decorativo con gradiente */}
        <div className="h-32 bg-gradient-to-br from-brand-red/30 via-brand-red/10 to-transparent relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMS42NTctMS4zNDMtMy0zLTNzLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzIDMtMS4zNDMgMy0zbTEyLTE4YzAtMS42NTctMS4zNDMtMy0zLTNzLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzIDMtMS4zNDMgMy0zTTI0IDBjMC0xLjY1Ny0xLjM0My0zLTMtM1MxOC0xLjY1NyAxOCAwczEuMzQzIDMgMyAzIDMtMS4zNDMgMy0zIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50"></div>
          
          {/* Boton cerrar si es modal */}
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm z-10"
            >
              ✕
            </button>
          )}
        </div>

        {/* Info principal del usuario */}
        <div className="px-6 pb-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            
            {/* Avatar grande */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-brand-red/20 border-4 border-[#121212] ring-2 ring-brand-red flex items-center justify-center text-brand-red font-bold text-3xl uppercase overflow-hidden shadow-[0_0_20px_rgba(255,51,51,0.3)]">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl.startsWith('http') ? avatarUrl : `http://localhost:8000${avatarUrl}`} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  avatarLetter
                )}
              </div>
              {/* Indicador de estado online */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-[3px] border-[#121212] rounded-full"></div>
            </div>

            {/* Nombre y badges */}
            <div className="flex-1 sm:pb-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-white">{username}</h1>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${roleColors[role] || roleColors.player}`}>
                  {role}
                </span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  availability.toLowerCase() === 'available' 
                    ? 'text-green-400 bg-green-400/10' 
                    : 'text-yellow-400 bg-yellow-400/10'
                }`}>
                  {availability}
                </span>
              </div>
              {fullName && (
                <p className="text-sm text-gray-400 mt-1">{fullName}</p>
              )}
              {email && isSelf && (
                <p className="text-xs text-gray-500 mt-0.5">{email}</p>
              )}
            </div>

            {/* Botones de accion */}
            <div className="flex gap-3 sm:pb-1">
              {isSelf ? (
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                >
                  <Settings size={16} />
                  Edit Profile
                </Link>
              ) : (
                <button onClick={handleMessage} className="flex items-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]">
                  <MessageSquare size={16} />
                  Message
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== BIO ===== */}
      <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
          <Star size={16} className="text-brand-red" />
          About
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">{bio}</p>
      </div>

      {/* ===== INFO GRID ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 text-center">
          <MapPin size={18} className="text-brand-red mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Region</p>
          <p className="text-sm text-white font-medium">{region}</p>
        </div>
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-4 text-center">
          <Globe size={18} className="text-brand-red mx-auto mb-2" />
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Language</p>
          <p className="text-sm text-white font-medium">{language}</p>
        </div>
      </div>

      {/* ===== GAMES & RANKS ===== */}
      {games.length > 0 && (
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Gamepad2 size={16} className="text-brand-red" />
            Games & Ranks
          </h2>
          <div className="space-y-3">
            {games.map((g, i) => (
              <div key={i} className="flex items-center justify-between bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 transition-all hover:border-gray-700">
                <div className="flex items-center gap-4">
                  {/* Caratula del juego */}
                  {g.cover_url ? (
                    <img 
                      src={g.cover_url.startsWith('//') ? `https:${g.cover_url}` : g.cover_url} 
                      alt={g.game || g.name} 
                      className="w-8 h-10 object-cover rounded border border-gray-800"
                    />
                  ) : (
                    <div className="w-8 h-10 bg-gray-800 rounded border border-gray-700 flex items-center justify-center">
                       <Gamepad2 size={16} className="text-gray-500"/>
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium text-sm">{g.game || g.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-0.5 rounded">
                        {g.rank}
                      </span>
                      {g.platform && (
                        <span className="text-[10px] text-gray-500">
                          {platformNames[g.platform.toLowerCase()] || g.platform}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Roles si existen */}
                  {g.roles && g.roles.length > 0 && (
                    <div className="hidden sm:flex items-center gap-2">
                      {g.roles.map((role, ri) => (
                        <span key={ri} className="text-[10px] text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {role}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Icono de plataforma */}
                  {g.platform && platformIcons[g.platform.toLowerCase()] && (
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platformStyles[g.platform.toLowerCase()] || 'bg-gray-800'}`}>
                      <img 
                        src={platformIcons[g.platform.toLowerCase()]} 
                        alt={g.platform} 
                        className={`${g.platform.toLowerCase() === 'mobile' ? 'w-6 h-6' : 'w-5 h-5'} brightness-0 invert`} 
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== MEMBER SINCE ===== */}
      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs pb-4">
        <Calendar size={12} />
        <span>{memberSince}</span>
      </div>
    </div>
  );
}

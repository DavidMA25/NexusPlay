import { Search, Filter, Bot, MapPin, MessageSquare } from 'lucide-react';

export default function FindPlayers() {
  
  // Datos estáticos provisionales (Mock Data) para que el backend lo sustituya luego
  const players = [
    {
      username: "Shadow",
      fullName: "Alex Chen",
      game: "Valorant",
      rank: "Immortal",
      roles: ["Duelist", "Initiator"],
      winRate: "68%",
      hours: "2450",
      location: "North America",
      avatarBg: "bg-yellow-500"
    },
    {
      username: "Viper",
      fullName: "Maya Johnson",
      game: "Valorant",
      rank: "Radiant",
      roles: ["Controller", "Sentinel"],
      winRate: "72%",
      hours: "3100",
      location: "Europe",
      avatarBg: "bg-gray-500"
    },
    {
      username: "Thunder",
      fullName: "Jake Williams",
      game: "CS2",
      rank: "Global Elite",
      roles: ["AWPer", "IGL"],
      winRate: "65%",
      hours: "4200",
      location: "North America",
      avatarBg: "bg-yellow-600"
    },
    {
      username: "Nova",
      fullName: "Sarah Kim",
      game: "League of Legends",
      rank: "Challenger",
      roles: ["Mid Laner", "Support"],
      winRate: "71%",
      hours: "5600",
      location: "Asia",
      avatarBg: "bg-cyan-500"
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* 1. Cabecera */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Find Players</h1>
        <p className="text-gray-400 text-sm">
          Discover talented players for your team or find teammates.
        </p>
      </div>

      {/* 2. Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search players by name, game, or rank..." 
            className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-500"
          />
        </div>
        <button 
          className="flex items-center justify-center gap-2 bg-[#121212] border border-gray-800 hover:border-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors"
        >
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* 3. Grid de Jugadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {players.map((player, index) => (
          <div 
            key={index} 
            className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-brand-red hover:shadow-[0_0_15px_rgba(255,51,51,0.15)] hover:-translate-y-1"
          >
            
            {/* Avatar con indicador de estado */}
            <div className="relative mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${player.avatarBg}`}>
                <Bot size={32} className="text-[#121212]" />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#121212] rounded-full"></div>
            </div>

            {/* Nombres */}
            <h3 className="text-lg font-bold text-white leading-tight">{player.username}</h3>
            <p className="text-xs text-gray-400 mt-1">{player.fullName}</p>

            {/* Etiquetas de Juego y Rango */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">
                {player.game}
              </span>
              <span className="text-[10px] font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded">
                {player.rank}
              </span>
            </div>

            {/* Roles */}
            <div className="flex gap-2 mt-3 text-xs text-gray-400">
              {player.roles.map((role, i) => (
                <span key={i}>{role}</span>
              ))}
            </div>

            {/* Estadísticas (Win Rate y Horas) */}
            <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
              <div>
                <p className="text-white font-bold text-sm">{player.winRate}</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Win Rate</p>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{player.hours}</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Hours</p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="flex items-center justify-center gap-1 mt-4 text-gray-400 text-xs">
              <MapPin size={12} />
              <span>{player.location}</span>
            </div>

            {/* Botones de acción */}
            <div className="w-full flex gap-3 mt-6">
              <button className="flex-1 bg-transparent border border-gray-700 hover:border-gray-500 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                View Profile
              </button>
              <button className="flex-1 bg-brand-red hover:bg-[#FF4D4D] text-white text-xs font-medium py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]">
                <MessageSquare size={14} />
                Message
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
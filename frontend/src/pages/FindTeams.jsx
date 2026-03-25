import { useState, useEffect } from "react";
import { Search, Filter, Bot, Users } from 'lucide-react';
// import { apiComunication } from "../modules/apiComunication"; <-- Dejamos su import comentado

export default function FindTeams() {
  
  // =========================================================================
  // CÓDIGO DEL BACKEND DE TUS COMPAÑEROS (COMENTADO PARA NO PERDERLO)
  // =========================================================================
  /*
  const [teamData, setTeamData] = useState(null);

  useEffect(() => {
      async function api() {
          if (!teamData) {
              let result = await apiComunication("GET", "/teams", "1|uW9qfY6ZnNSG0Xk7oWDHJTl4YA8dFa1it7vsfRpZ1bb026a9")
              setTeamData(result.data || null);
          }
      };
      api();
  }, [])
  */
  // =========================================================================

  const teams = [
    {
      name: "Phoenix Squad",
      game: "Valorant",
      level: "Semi-Pro",
      members: "3/5",
      lookingFor: ["Controller", "Initiator"],
      winRate: "67%",
      tournaments: "12",
      avatarBg: "bg-yellow-500",
      isFull: false
    },
    {
      name: "Dark Knights",
      game: "CS2",
      level: "Pro",
      members: "4/5",
      lookingFor: ["Lurker"],
      winRate: "72%",
      tournaments: "24",
      avatarBg: "bg-yellow-600",
      isFull: false
    },
    {
      name: "Storm Riders",
      game: "Valorant",
      level: "Pro",
      members: "5/5",
      lookingFor: [],
      winRate: "75%",
      tournaments: "18",
      avatarBg: "bg-yellow-400",
      isFull: true
    },
    {
      name: "Eclipse Gaming",
      game: "League of Legends",
      level: "Semi-Pro",
      members: "3/5",
      lookingFor: ["Top Laner", "Jungler"],
      winRate: "64%",
      tournaments: "10",
      avatarBg: "bg-blue-500",
      isFull: false
    },
    {
      name: "Northern Lights",
      game: "Overwatch 2",
      level: "Amateur",
      members: "2/6",
      lookingFor: ["Tank", "DPS", "Support", "Flex"],
      winRate: "58%",
      tournaments: "3",
      avatarBg: "bg-blue-600",
      isFull: false
    },
    {
      name: "Desert Storm",
      game: "Rocket League",
      level: "Semi-Pro",
      members: "3/3",
      lookingFor: [],
      winRate: "69%",
      tournaments: "15",
      avatarBg: "bg-gray-500",
      isFull: true
    }
  ];

  return (
    <div className="space-y-8">
      
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Find Teams</h1>
        <p className="text-gray-400 text-sm">
          Discover teams looking for players like you.
        </p>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search teams by name or game..." 
            className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-500"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#121212] border border-gray-800 hover:border-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Grid de Equipos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => (
          <div 
            key={index} 
            className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:border-brand-red hover:shadow-[0_0_15px_rgba(255,51,51,0.15)] hover:-translate-y-1"
          >
            
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${team.avatarBg}`}>
              <Bot size={32} className="text-[#121212]" />
            </div>

            <h3 className="text-lg font-bold text-white leading-tight">{team.name}</h3>

            <div className="flex items-center gap-2 mt-3">
              <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">
                {team.game}
              </span>
              <span className="text-[10px] font-bold text-gray-300 bg-gray-800 px-2 py-1 rounded">
                {team.level}
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-4 text-gray-400 text-xs">
              <Users size={14} />
              <span>{team.members} Members</span>
            </div>

            <div className="h-5 mt-3 text-xs">
              {!team.isFull && (
                <p className="text-gray-400">
                  Looking for: <span className="text-brand-red font-medium">{team.lookingFor.join(", ")}</span>
                </p>
              )}
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-800">
              <div>
                <p className="text-white font-bold text-sm">{team.winRate}</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Win Rate</p>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{team.tournaments}</p>
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mt-0.5">Tournaments</p>
              </div>
            </div>

            <div className="w-full flex gap-3 mt-6">
              <button className="flex-1 bg-transparent border border-gray-700 hover:border-gray-500 text-white text-xs font-medium py-2 rounded-lg transition-colors">
                View Team
              </button>
              
              {team.isFull ? (
                <button className="flex-1 bg-transparent border border-gray-800 text-gray-500 text-xs font-medium py-2 rounded-lg cursor-not-allowed">
                  Full Roster
                </button>
              ) : (
                <button className="flex-1 bg-brand-red hover:bg-[#FF4D4D] text-white text-xs font-medium py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]">
                  Apply to Join
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
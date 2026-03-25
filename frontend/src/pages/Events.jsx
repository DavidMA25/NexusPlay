import {
  Search,
  Filter,
  Trophy,
  Calendar,
  MapPin,
  Users,
  Activity,
} from "lucide-react";

export default function Events() {
  const events = [
    {
      title: "NexusPlay Summer Championship",
      game: "Valorant",
      date: "Mar 15, 2026",
      location: "Online - NA/EU",
      registered: "48/64",
      prize: "$25,000",
      fee: "FREE",
      status: "upcoming",
    },
    {
      title: "Weekly Showdown #42",
      game: "CS2",
      date: "Feb 14, 2026",
      location: "Online - Global",
      registered: "28/32",
      prize: "$1,000",
      fee: "$5",
      status: "upcoming",
    },
    {
      title: "Apex Predator Invitational",
      game: "Apex Legends",
      date: "Feb 11, 2026",
      location: "Online - NA",
      registered: "20/20",
      prize: "$10,000",
      fee: "FREE",
      status: "live",
    },
    {
      title: "LoL Draft Kings Cup",
      game: "League of Legends",
      date: "Feb 10, 2026",
      location: "Online - EU",
      registered: "16/16",
      prize: "$5,000",
      fee: "$10",
      status: "upcoming",
    },
    {
      title: "Rocket League Freestyle Jam",
      game: "Rocket League",
      date: "Feb 5, 2026",
      location: "Online - Global",
      registered: "64/64",
      prize: "$500",
      fee: "FREE",
      status: "completed",
    },
    {
      title: "Overwatch Heroes Clash",
      game: "Overwatch 2",
      date: "Jan 28, 2026",
      location: "Online - NA",
      registered: "32/32",
      prize: "$2,500",
      fee: "FREE",
      status: "completed",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Tournaments & Events
        </h1>
        <p className="text-gray-400 text-sm">
          Find and compete in tournaments across all games.
        </p>
      </div>

      {/* Pestañas de Navegacion */}
      <div className="flex flex-wrap gap-2">
        <button className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          All
        </button>
        <button className="bg-transparent border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Upcoming
        </button>
        <button className="flex items-center gap-2 bg-transparent border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Live Now <Activity size={14} />
        </button>
        <button className="bg-transparent border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Past
        </button>
      </div>

      {/* Barra de Busqueda y Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full bg-[#121212] border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-500"
          />
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#121212] border border-gray-800 hover:border-gray-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-colors">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Grid de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-[#121212] border border-gray-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-brand-red hover:shadow-[0_0_15px_rgba(255,51,51,0.15)] hover:-translate-y-1"
          >
            {/* Banner superior con el trofeo y etiquetas de estado */}
            <div className="h-32 bg-gradient-to-br from-[#FF3333]/10 to-transparent relative flex items-center justify-center border-b border-gray-800">
              <Trophy size={40} className="text-brand-red opacity-80" />

              {event.status === "live" && (
                <span className="absolute top-3 right-3 flex items-center gap-1.5 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  LIVE
                </span>
              )}

              {event.status === "completed" && (
                <span className="absolute top-3 right-3 bg-gray-800 text-gray-300 text-[10px] font-bold px-2 py-1 rounded">
                  Completed
                </span>
              )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-white leading-tight truncate">
                {event.title}
              </h3>

              <div className="mt-2 mb-4">
                <span className="text-[10px] font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">
                  {event.game}
                </span>
              </div>

              {/* Detalles (Fecha, Ubicacion, Inscritos) */}
              <div className="space-y-2.5 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={14} />
                  <span>{event.registered} Registered</span>
                </div>
              </div>

              {/* Footer con los premios (Prize Pool y Fee) */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-800">
                <div className="flex items-baseline gap-1">
                  <span className="text-brand-red font-bold text-sm">
                    {event.prize}
                  </span>
                  <span className="text-gray-500 text-[10px] uppercase">
                    Prize Pool
                  </span>
                </div>

                {event.fee === "FREE" ? (
                  <span className="text-green-400 bg-green-400/10 text-[10px] font-bold px-2 py-1 rounded">
                    FREE
                  </span>
                ) : (
                  <span className="text-gray-400 bg-gray-800 text-[10px] font-bold px-2 py-1 rounded">
                    {event.fee}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

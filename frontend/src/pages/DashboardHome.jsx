import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  MessageSquare, 
  Gamepad2, 
  UserPlus, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  
  // 1. Array de Estadísticas (El que ya teníamos)
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
      
      {/* Cabecera de bienvenida */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-brand-red">{user?.name || 'User'}</span>!
        </h1>
        <p className="text-gray-400 text-sm">
          Here's what's happening with your eSports career.
        </p>
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
         
         {/* COLUMNA IZQUIERDA: Recent Activity (Ocupa 2/3 del espacio) */}
         <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activities.map((item, index) => (
                <div 
                  key={index} 
                  className="bg-[#121212] border border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    {/* Icono de la actividad */}
                    <div className="w-12 h-12 rounded-lg bg-brand-red/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    {/* Textos */}
                    <div>
                      <h4 className="text-white font-medium text-sm">{item.title}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                      <p className="text-gray-500 text-[10px] mt-1.5">{item.time}</p>
                    </div>
                  </div>
                  
                  {/* Botón de acción con efecto de brillo */}
                  <button 
                    className="flex items-center justify-center gap-2 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white px-4 py-2 rounded-lg text-xs font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.1)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)] whitespace-nowrap"
                  >
                    {item.btnText} <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
         </div>

         {/* COLUMNA DERECHA: Recommended & Events (Ocupa 1/3 del espacio) */}
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

    </div>
  );
}
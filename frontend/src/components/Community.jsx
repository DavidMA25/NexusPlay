import { Star, TrendingUp, Send, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Community() {
    const navigate = useNavigate();
    // Aquí guardo mensajes de palo para que el chat no se vea vacío.
    // Cuando Mario termine su parte, esto vendrá de la base de datos de Laravel.
    const dummyMessages = [
        { id: 1, user: "Shadow", color: "text-brand-red", time: "2m ago", text: "Ready for scrims tonight?" },
        { id: 2, user: "Viper", color: "text-green-500", time: "1m ago", text: "Yep, warmed up and ready 🔥" },
        { id: 3, user: "Thunder", color: "text-blue-500", time: "just now", text: "Let's run the new strat we practiced" }
    ];

    return (
        <section className="py-16 md:py-20 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

            {/* IZQUIERDA: Textos y el botón principal */}
            <div className="flex-1">
                <span className="text-brand-red font-bold text-sm tracking-widest uppercase">
                    Join the Community
                </span>
                <h2 className="text-white text-3xl sm:text-4xl md:text-6xl font-bold mt-4 mb-6 leading-tight">
                    Be Part of the <span className="text-brand-red">Next Generation</span> of eSports
                </h2>
                <p className="text-gray-400 text-lg mb-10 max-w-xl">
                    Únete a miles de jugadores y equipos que ya están creando su legado en NexusPlay.
                </p>

                {/* Un par de stats para que la sección rellene más */}
                <div className="flex flex-wrap gap-8 mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-red/10 rounded-lg text-brand-red">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-white font-bold">4.9 Rating</p>
                            <p className="text-gray-500 text-sm">De más de 10K reviews</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-red/10 rounded-lg text-brand-red">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <p className="text-white font-bold">$2M+</p>
                            <p className="text-gray-500 text-sm">Premios mensuales</p>
                        </div>
                    </div>
                </div>

                <button onClick={() => navigate('/register')} className="bg-brand-red hover:bg-[#FF4D4D] text-white text-sm font-medium py-2 px-6 rounded-md transition duration-300 shadow-lg shadow-brand-red/20 flex items-center gap-2">
                    Join Now <ArrowRight size={16} />
                </button>
            </div>

            {/* DERECHA: El mockup del chat (esto lo tiene que conectar Mario luego) */}
            <div className="flex-1 w-full max-w-md">
                <div className="bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">

                    {/* Cabecera del chat */}
                    <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></div>
                            <h3 className="text-white font-bold">Team Chat</h3>
                        </div>
                        <span className="text-gray-500 text-xs">12 online</span>
                    </div>

                    {/* Lista de mensajes del chat */}
                    <div className="p-6 space-y-6 h-[300px] overflow-y-auto">
                        {dummyMessages.map((msg) => (
                            <div key={msg.id} className="flex gap-4">
                                {/* Uso shrink-0 para que el avatar no se aplaste si el texto es largo */}
                                <div className="w-10 h-10 rounded-full bg-gray-800 shrink-0"></div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-bold text-sm ${msg.color}`}>{msg.user}</span>
                                        <span className="text-gray-600 text-[10px]">{msg.time}</span>
                                    </div>
                                    <p className="text-gray-300 text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* El input donde se escribiría (de momento solo visual) */}
                    <div className="p-4 bg-[#0a0a0a] border-t border-gray-800">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
                            />
                            <button className="absolute right-2 p-2 bg-brand-red rounded-lg text-white">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
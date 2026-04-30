import { useState } from 'react';
import {
    Edit,
    Gamepad2,
    Target,
    Trophy,
    Star,
    Calendar,
    MapPin,
    Globe,
    Users
} from 'lucide-react';

export default function TeamProfile() {
    // Guardo en el estado la pestaña que esta activa. Por defecto arranco en Overview.
    const [activeTab, setActiveTab] = useState('Overview');

    // Las pestañas que salen en el menu del medio
    const tabs = ['Overview', 'Roster', 'Achievements', 'Match History', 'Recruitment'];

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">

            {/* CABECERA: EL BANNER ROJO, AVATAR Y LA BIO */}
            <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden shadow-xl relative">

                {/* El difuminado rojo del fondo de la tarjeta */}
                <div className="h-48 bg-gradient-to-b from-[#FF3333]/20 to-[#121212] w-full absolute top-0 left-0 z-0"></div>

                {/* Contenido centrado (z-10 para que se quede por encima del fondo) */}
                <div className="relative z-10 flex flex-col items-center pt-12 pb-8 px-6 text-center">

                    {/* El avatar amarillo de Phoenix Squad */}
                    <div className="w-24 h-24 bg-[#FFB800] rounded-full border-4 border-[#121212] shadow-lg flex items-center justify-center mb-4">
                        <div className="w-12 h-4 bg-gray-900 rounded-full relative">
                            <div className="absolute top-1 left-2 w-2 h-2 bg-[#FFB800] rounded-full"></div>
                            <div className="absolute top-1 right-2 w-2 h-2 bg-[#FFB800] rounded-full"></div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-white mb-3">Phoenix Squad</h1>

                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-bold text-brand-red bg-brand-red/10 px-2 py-1 rounded">Valorant</span>
                        <span className="text-xs font-bold text-gray-400 bg-gray-800 px-2 py-1 rounded">Semi-Pro</span>
                    </div>

                    <p className="text-sm text-gray-400 max-w-xl mx-auto mb-6">
                        Competitive Valorant team looking for dedicated players to complete our roster.
                        We practice 5 days a week and compete in weekly tournaments.
                    </p>

                    <button className="flex items-center gap-2 bg-[#FF3333] hover:bg-[#ff4d4d] text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,51,51,0.2)]">
                        <Edit size={16} />
                        Edit Team
                    </button>
                </div>
            </div>

            {/*NAVEGACION DE PESTAÑAS*/}
            <div className="flex items-center gap-6 border-b border-gray-800 px-2">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                            }`}
                    >
                        {tab}
                        {/* La rayita roja de abajo que indica cual esta activa */}
                        {activeTab === tab && (
                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-red rounded-t-full"></span>
                        )}
                    </button>
                ))}
            </div>

            {/* ZONA DINAMICA: AQUI RENDERIZO LO QUE TOQUE SEGUN LA PESTAÑA */}
            <div className="animate-fade-in">

                {/* PESTAÑA: OVERVIEW */}
                {activeTab === 'Overview' && (
                    <div className="space-y-6">
                        {/* Fila de estadisticas */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <Gamepad2 className="text-brand-red mb-2" size={24} />
                                <span className="text-2xl font-bold text-white">156</span>
                                <span className="text-xs text-gray-500 uppercase font-bold mt-1">Total Matches</span>
                            </div>
                            <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <Target className="text-brand-red mb-2" size={24} />
                                <span className="text-2xl font-bold text-white">67%</span>
                                <span className="text-xs text-gray-500 uppercase font-bold mt-1">Win Rate</span>
                            </div>
                            <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <Trophy className="text-brand-red mb-2" size={24} />
                                <span className="text-2xl font-bold text-white">12</span>
                                <span className="text-xs text-gray-500 uppercase font-bold mt-1">Tournaments</span>
                            </div>
                            <div className="bg-[#121212] border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center text-center">
                                <Star className="text-brand-red mb-2" size={24} />
                                <span className="text-2xl font-bold text-white">3</span>
                                <span className="text-xs text-gray-500 uppercase font-bold mt-1">Championships</span>
                            </div>
                        </div>

                        {/* Bloque de About */}
                        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-6">About</h2>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Calendar className="text-brand-red" size={18} />
                                    <span className="text-gray-500">Founded:</span>
                                    <span>15/6/2023</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <MapPin className="text-brand-red" size={18} />
                                    <span className="text-gray-500">Region:</span>
                                    <span>North America</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Globe className="text-brand-red" size={18} />
                                    <span className="text-gray-500">Languages:</span>
                                    <span>English</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Users className="text-brand-red" size={18} />
                                    <span className="text-gray-500">Roster:</span>
                                    <span>3/5 Members</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PESTAÑA: ROSTER */}
                {activeTab === 'Roster' && (
                    <div className="space-y-6">

                        {/* Miembros actuales */}
                        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Current Roster</h2>
                            <div className="space-y-3">
                                {/* Jugador 1 */}
                                <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#FFB800] rounded-full border-2 border-gray-800"></div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Alex</p>
                                            <p className="text-xs text-brand-red">IGL / Entry</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-gray-400 bg-gray-800 hover:text-white px-3 py-1.5 rounded transition-colors">View Profile</button>
                                </div>
                                {/* Jugador 2 */}
                                <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#4D94FF] rounded-full border-2 border-gray-800"></div>
                                        <div>
                                            <p className="text-sm font-bold text-white">Phantom</p>
                                            <p className="text-xs text-gray-500">Sentinel</p>
                                        </div>
                                    </div>
                                    <button className="text-xs text-gray-400 bg-gray-800 hover:text-white px-3 py-1.5 rounded transition-colors">View Profile</button>
                                </div>
                            </div>
                        </div>

                        {/* Lo que buscan (Reclutamiento) */}
                        <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4">We're Looking For</h2>
                            <div className="space-y-3">
                                <div className="bg-[#0a0a0a] border border-gray-800 hover:border-brand-red/50 transition-colors rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded bg-brand-red/10 flex items-center justify-center">
                                            <Target className="text-brand-red" size={16} />
                                        </div>
                                        <p className="text-sm font-medium text-white">Controller</p>
                                    </div>
                                    <button className="bg-brand-red text-white text-xs font-bold px-4 py-2 rounded shadow-lg">Apply Now</button>
                                </div>
                                <div className="bg-[#0a0a0a] border border-gray-800 hover:border-brand-red/50 transition-colors rounded-lg p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded bg-brand-red/10 flex items-center justify-center">
                                            <Target className="text-brand-red" size={16} />
                                        </div>
                                        <p className="text-sm font-medium text-white">Initiator</p>
                                    </div>
                                    <button className="bg-brand-red text-white text-xs font-bold px-4 py-2 rounded shadow-lg">Apply Now</button>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {/* PESTAÑAS VACIAS (Achievements, Match History, Recruitment) */}
                {['Achievements', 'Match History', 'Recruitment'].includes(activeTab) && (
                    <div className="bg-[#121212] border border-gray-800 rounded-xl p-16 flex flex-col items-center justify-center text-center">
                        <Trophy className="text-gray-600 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-white mb-2">{activeTab} coming soon</h3>
                        <p className="text-sm text-gray-500">This section is under development</p>
                    </div>
                )}

            </div>
        </div>
    );
}
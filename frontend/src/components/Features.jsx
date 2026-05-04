import { Gamepad2, Users, Target, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import imgFindYourGame from '../assets/find-your-game.png';
import imgBuildTeams from '../assets/build-teams.jpg';
import imgMatchSystem from '../assets/match-system.jpg';
import imgInstantTryout from '../assets/instant-tryout.jpg';

export default function Features() {
    const navigate = useNavigate();
    const features = [
        {
            title: "Find Your Game",
            desc: "Connect with players who share your passion for specific games and genres.",
            icon: <Gamepad2 size={24} />,
            img: imgFindYourGame,
        },
        {
            title: "Build Teams",
            desc: "Create or join competitive teams with verified skill ratings and stats.",
            icon: <Users size={24} />,
            img: imgBuildTeams,
        },
        {
            title: "Match System",
            desc: "Our AI-powered algorithm finds the perfect teammates for your playstyle.",
            icon: <Target size={24} />,
            img: imgMatchSystem,
        },
        {
            title: "Instant Tryouts",
            desc: "Schedule and manage tryouts with integrated voice chat and screen sharing.",
            icon: <Zap size={24} />,
            img: imgInstantTryout,
        }
    ];

    return (
        <section className="py-20 px-4 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <span className="text-brand-red font-bold text-sm tracking-widest uppercase">
                    Discover NexusPlay
                </span>
                <h2 className="text-white text-4xl md:text-5xl font-bold mt-4 mb-6">
                    Everything You Need to <span className="text-brand-red">Compete</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    From amateur leagues to professional circuits, we've got the tools to take your career to the next level.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((f, index) => (
                    <div
                        key={index}
                        onClick={() => navigate('/dashboard')}
                        className="group rounded-2xl bg-[#121212] border border-gray-800 overflow-hidden transition-all duration-300 hover:border-brand-red cursor-pointer"
                    >
                        {/* imagen de cabecera de la tarjeta */}
                        <div className="relative h-44 overflow-hidden">
                            <img
                                src={f.img}
                                alt={f.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                        </div>

                        <div className="p-6">
                            <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-brand-red mb-4 group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-white text-xl font-bold mb-3">
                                {f.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed group-hover:text-brand-red transition-colors">
                                {f.desc}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

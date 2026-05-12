import { User, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Stats from './Stats';
import heroBg from '../assets/hero.jpg';

export default function Hero() {
    const navigate = useNavigate();
    return (
        <div className="relative flex flex-col items-center justify-center pt-24 pb-16 md:pt-32 md:pb-20 px-4 text-center overflow-hidden bg-[#0a0a0a]">

            {}
            <img
                src={heroBg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
            />
            <div className="absolute inset-0 bg-red-950/25" />
            {}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]" />

            <div className="relative z-10 flex flex-col items-center w-full">

            {}
            <div className="border border-gray-800 rounded-full px-4 py-1.5 mb-8 flex items-center gap-2 bg-black/50">
                <div className="w-2 h-2 rounded-full bg-brand-red shadow-[0_0_8px_rgba(255,51,51,0.8)]"></div>
                <span className="text-gray-400 text-sm">The #1 eSports Recruitment Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Elevate Your Game.<br />
                Find Your <span className="text-brand-red">Squad.</span>
            </h1>

            <p className="text-gray-400 text-base md:text-xl max-w-2xl mb-10">
                The professional hub for eSports recruitment. Connect with teams, manage tryouts, and build your legacy.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/register')} className="flex items-center justify-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-8 py-3 rounded-md font-medium transition-all shadow-[0_0_20px_rgba(255,51,51,0.3)] hover:shadow-[0_0_25px_rgba(255,51,51,0.5)]">
                    <User size={20} />
                    I'm a Player
                </button>

                <button onClick={() => navigate('/register')} className="flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 hover:bg-gray-900 text-white px-8 py-3 rounded-md font-medium transition-all">
                    <Trophy size={20} />
                    I'm a Team
                </button>
            </div>

            <Stats />

            </div>
        </div>
    )
}
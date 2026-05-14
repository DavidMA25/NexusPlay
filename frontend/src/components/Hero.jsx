import Stats from './Stats';
import heroBg from '../assets/hero.jpg';

export default function Hero() {
    return (
        <div className="relative flex flex-col items-center justify-center min-h-[85vh] pt-24 pb-16 px-4 text-center overflow-hidden bg-[#0a0a0a]">

            {/* Background elements */}
            <img
                src={heroBg}
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top opacity-20"
            />
            <div className="absolute inset-0 bg-red-950/25" />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/50 via-transparent to-[#0a0a0a]" />

            <div className="relative z-10 flex flex-col items-center w-full">

            {/* Tagline Badge */}
            <div className="border border-gray-800 rounded-full px-4 py-1.5 mb-8 flex items-center gap-2 bg-black/50">
                <div className="w-2 h-2 rounded-full bg-brand-red shadow-[0_0_8px_rgba(255,51,51,0.8)]"></div>
                <span className="text-gray-400 text-sm">The #1 eSports Recruitment Platform</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Elevate Your Game.<br />
                Find Your <span className="text-brand-red">Squad.</span>
            </h1>

            <p className="text-gray-400 text-base md:text-xl max-w-2xl mb-2">
                The professional hub for eSports recruitment. Connect with teams, manage tryouts, and build your legacy.
            </p>

            <Stats />

            </div>
        </div>
    )
}
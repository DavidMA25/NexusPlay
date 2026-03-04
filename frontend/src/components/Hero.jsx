import { User, Trophy } from 'lucide-react';
import Stats from './Stats';

export default function Hero() {
    return (
        <div className="flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center">

            {/* Etiqueta superior (Píldora) */}
            <div className="border border-gray-800 rounded-full px-4 py-1.5 mb-8 flex items-center gap-2 bg-black/50">
                <div className="w-2 h-2 rounded-full bg-brand-red shadow-[0_0_8px_rgba(255,51,51,0.8)]"></div>
                <span className="text-gray-400 text-sm">The #1 eSports Recruitment Platform</span>
            </div>

            {/* Título Gigante */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                Elevate Your Game.<br />
                Find Your <span className="text-brand-red">Squad.</span>
            </h1>

            {/* Subtítulo */}
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10">
                The professional hub for eSports recruitment. Connect with teams, manage tryouts, and build your legacy.
            </p>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-8 py-3 rounded-md font-medium transition-all shadow-[0_0_20px_rgba(255,51,51,0.3)] hover:shadow-[0_0_25px_rgba(255,51,51,0.5)]">
                    <User size={20} />
                    I'm a Player
                </button>

                <button className="flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500 hover:bg-gray-900 text-white px-8 py-3 rounded-md font-medium transition-all">
                    <Trophy size={20} />
                    I'm a Team
                </button>
            </div>

            <Stats />

        </div>
    )
}
import { Play } from 'lucide-react';

export default function VideoSection() {
    return (
        <section className="py-24 px-4 max-w-7xl mx-auto text-center">
            {/* El título pequeño de arriba */}
            <span className="text-brand-red font-bold text-sm tracking-widest uppercase block mb-4">
                See it in action
            </span>

            {/* Título principal con NexusPlay resaltado en rojo */}
            <h2 className="text-white text-4xl md:text-6xl font-bold mb-6">
                Watch How <span className="text-brand-red">NexusPlay</span> Works
            </h2>

            {/* Descripción breve */}
            <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-16">
                From creating your profile to joining a pro team — see the full journey in under 2 minutes.
            </p>

            {/* Contenedor del Vídeo con el brillo rojo */}
            <div className="relative group max-w-5xl mx-auto">
                {/* Este div de abajo hace el efecto de resplandor rojo detrás del vídeo */}
                <div className="absolute -inset-1 bg-brand-red/20 rounded-3xl blur-xl group-hover:bg-brand-red/30 transition duration-500"></div>

                {/* El reproductor de vídeo */}
                <div className="relative aspect-video bg-[#121212] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">

                    {/* Imagen de portada del vídeo */}
                    <img
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80"
                        alt="Video Preview"
                        className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-500"
                    />

                    {/* Botón de Play central */}
                    <button onClick={() => window.open('https://www.youtube.com/watch?v=e_E9W2vsRbQ', '_blank', 'noopener,noreferrer')} className="relative w-20 h-20 bg-brand-red rounded-full flex items-center justify-center text-white shadow-xl shadow-brand-red/40 hover:scale-110 transition-transform duration-300">
                        <Play size={32} fill="currentColor" className="ml-1" />
                    </button>

                    {/* Barra de progreso de palo abajo del todo */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gray-800">
                        <div className="h-full bg-brand-red w-1/3"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
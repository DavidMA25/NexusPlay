import { useState } from 'react';
import { Camera, Plus, Trash2, Save, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettings() {
    // Me traigo al usuario del contexto para precargar su nombre
    const { user } = useAuth();

    // Estados para la informacion basica del perfil
    const [username, setUsername] = useState(user?.name || '');
    const [bio, setBio] = useState('');
    const [language, setLanguage] = useState('Spanish');

    // Estado dinamico para los juegos. Empieza con uno por defecto vacio o de ejemplo.
    // Usamos Date.now() para generar IDs unicos rapidos para que React no se queje al renderizar listas.
    const [userGames, setUserGames] = useState([
        { id: 1, game: 'Valorant', rank: 'Diamond' }
    ]);

    // Funcion para anadir una nueva fila de juego al pulsar el boton "+"
    const addGameRow = () => {
        setUserGames([...userGames, { id: Date.now(), game: '', rank: '' }]);
    };

    // Funcion para borrar una fila concreta al pulsar la papelera
    const removeGameRow = (idToRemove) => {
        setUserGames(userGames.filter(game => game.id !== idToRemove));
    };

    // Funcion para actualizar el texto de un input concreto dentro del array de juegos
    const handleGameChange = (id, field, value) => {
        setUserGames(userGames.map(game => 
            game.id === id ? { ...game, [field]: value } : game
        ));
    };

    // Funcion que se ejecuta al darle al boton de guardar
    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui es donde Mario y Daniel conectaran su API para guardar en base de datos.
        // De momento, lo escupimos por consola para demostrar que el frontend recopila todo bien.
        console.log("Datos listos para enviar al backend:", { username, bio, language, userGames });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-10">
            
            {/* Cabecera */}
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
                <p className="text-gray-400 text-sm">
                    Manage your public profile, bio, and gaming roster.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECCION 1: Avatar y Datos Basicos */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <User size={20} className="text-brand-red" />
                        Basic Information
                    </h2>
                    
                    {/* Zona del Avatar */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative group cursor-pointer">
                            <div className="w-24 h-24 rounded-full bg-brand-red/20 border-2 border-brand-red flex items-center justify-center text-brand-red font-bold text-3xl uppercase overflow-hidden">
                                {username.charAt(0) || 'U'}
                                {/* Overlay oscuro que aparece al pasar el raton para simular que puedes cambiar la foto */}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <button type="button" className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors mb-2 block">
                                Upload New Avatar
                            </button>
                            <p className="text-xs text-gray-500">Recomended size: 256x256px. Max 2MB.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Username</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                            />
                        </div>

                        {/* Language */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Preferred Language</label>
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors appearance-none"
                            >
                                <option value="Spanish">Spanish</option>
                                <option value="English">English</option>
                                <option value="French">French</option>
                            </select>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2 mt-6">
                        <label className="text-sm font-medium text-gray-300">Biography</label>
                        <textarea 
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell everyone a bit about yourself, your playstyle, and what you are looking for..."
                            rows="4"
                            className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* SECCION 2: Juegos y Rangos (La parte dinamica que pidio Mario) */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-white">Games & Ranks</h2>
                        <button 
                            type="button"
                            onClick={addGameRow}
                            className="flex items-center gap-2 text-sm text-brand-red hover:text-[#ff4d4d] font-medium transition-colors"
                        >
                            <Plus size={16} /> Add Game
                        </button>
                    </div>

                    <div className="space-y-4">
                        {userGames.map((gameObj) => (
                            <div key={gameObj.id} className="flex items-center gap-4 bg-[#0a0a0a] p-4 rounded-lg border border-gray-800">
                                
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Game</label>
                                    <input 
                                        type="text" 
                                        value={gameObj.game}
                                        onChange={(e) => handleGameChange(gameObj.id, 'game', e.target.value)}
                                        placeholder="e.g. League of Legends"
                                        className="w-full bg-transparent text-sm text-white focus:outline-none"
                                    />
                                </div>
                                
                                <div className="w-px h-10 bg-gray-800 mx-2 hidden sm:block"></div>

                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Rank / Level</label>
                                    <input 
                                        type="text" 
                                        value={gameObj.rank}
                                        onChange={(e) => handleGameChange(gameObj.id, 'rank', e.target.value)}
                                        placeholder="e.g. Diamond II"
                                        className="w-full bg-transparent text-sm text-white focus:outline-none"
                                    />
                                </div>

                                {/* Boton para borrar esa fila en concreto. Si solo queda 1, lo deshabilitamos para que no se quede vacio */}
                                <button 
                                    type="button"
                                    onClick={() => removeGameRow(gameObj.id)}
                                    disabled={userGames.length === 1}
                                    className={`p-2 rounded-lg transition-colors ${
                                        userGames.length === 1 
                                            ? 'text-gray-700 cursor-not-allowed' 
                                            : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                                    }`}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer con el boton de guardar */}
                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        className="flex items-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    );
}
import { useState, useRef } from 'react';
import { Camera, Plus, Trash2, Save, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettings() {
    // Me traigo al usuario del contexto para precargar su nombre
    const { user, api, updateUser } = useAuth();

    // Estados para la informacion basica del perfil
    const [username, setUsername] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [language, setLanguage] = useState(user?.profile?.languages || 'Spanish');
    const [region, setRegion] = useState(user?.profile?.region || 'Europe');
    const [statusMessage, setStatusMessage] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => fileInputRef.current.click();
    
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    // Estado dinamico para los juegos. Empieza con uno por defecto vacio o de ejemplo.
    // Usamos Date.now() para generar IDs unicos rapidos para que React no se queje al renderizar listas.
    const [userGames, setUserGames] = useState(
        user?.stats?.length > 0 
        ? user.stats.map(stat => ({
            id: stat.id,
            game: stat.game_name || `Game #${stat.game_igdb_id}`,
            rank: stat.rank_tier,
            platform: stat.platform || 'PC'
          }))
        : [{ id: Date.now(), game: 'Valorant', rank: 'Diamond', platform: 'PC' }]
    );

    // Funcion para anadir una nueva fila de juego al pulsar el boton "+"
    const addGameRow = () => {
        setUserGames([...userGames, { id: Date.now(), game: '', rank: '', platform: 'PC' }]);
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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        try {
            const formData = new FormData();
            formData.append('name', username);
            if (bio) formData.append('bio', bio);
            if (language) formData.append('language', language);
            if (region) formData.append('region', region);
            if (avatarFile) formData.append('avatar', avatarFile);
            
            formData.append('games', JSON.stringify(userGames));

            const response = await api.post('/user/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (updateUser && response.data.user) {
                updateUser(response.data.user);
            }
            setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Error updating profile:", error);
            setStatusMessage({ type: 'error', text: 'Error updating profile. Please ensure the username is valid.' });
        }
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

            {statusMessage && (
                <div className={`p-4 rounded-lg text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-500'}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* SECCION 1: Avatar y Datos Basicos */}
                <div className="bg-[#121212] border border-gray-800 rounded-xl p-6">
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <User size={20} className="text-brand-red" />
                        Basic Information
                    </h2>
                    
                    {/* Zona del Avatar */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                            <div className="w-24 h-24 rounded-full bg-brand-red/20 border-2 border-brand-red flex items-center justify-center text-brand-red font-bold text-3xl uppercase overflow-hidden">
                                {avatarPreview ? (
                                    <img src={avatarPreview.startsWith('blob:') ? avatarPreview : `http://localhost:8000${avatarPreview}`} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    username.charAt(0) || 'U'
                                )}
                                {/* Overlay oscuro que aparece al pasar el raton para simular que puedes cambiar la foto */}
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleAvatarChange} 
                                accept=".jpg,.jpeg,.png" 
                                className="hidden" 
                            />
                            <button type="button" onClick={handleAvatarClick} className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors mb-2 block">
                                Upload New Avatar
                            </button>
                            <p className="text-xs text-gray-500">Recommended size: 256x256px. Max 2MB.</p>
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

                        {/* Region */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Region</label>
                            <select 
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors appearance-none"
                            >
                                <option value="Asia">Asia</option>
                                <option value="Europe">Europe</option>
                                <option value="North America">North America</option>
                                <option value="South America">South America</option>
                                <option value="Oceania">Oceania</option>
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

                                <div className="w-px h-10 bg-gray-800 mx-2 hidden sm:block"></div>

                                <div className="flex-1 space-y-1">
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Platform</label>
                                    <select 
                                        value={gameObj.platform || 'PC'}
                                        onChange={(e) => handleGameChange(gameObj.id, 'platform', e.target.value)}
                                        className="w-full bg-transparent text-sm text-white focus:outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="PC" className="bg-[#0a0a0a]">PC</option>
                                        <option value="PlayStation" className="bg-[#0a0a0a]">PlayStation</option>
                                        <option value="Xbox" className="bg-[#0a0a0a]">Xbox</option>
                                        <option value="Nintendo" className="bg-[#0a0a0a]">Nintendo</option>
                                        <option value="Mobile" className="bg-[#0a0a0a]">Mobile</option>
                                    </select>
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
import { useState, useRef } from 'react';
import { Camera, Save, Plus, Trash2, Search, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

import GameSearchInput from '../GameSearchInput';

const PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile'];
const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Portuguese', 'Italian', 'Russian'];
const REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Oceania'];

export default function ProfileSettingsTab() {
    const { user, api, updateUser } = useAuth();

    const [username, setUsername] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [region, setRegion] = useState(user?.profile?.region || 'Europe');

    const initialLanguages = user?.profile?.languages ? user.profile.languages.split(',').map(l => l.trim()) : ['Spanish'];
    const [primaryLanguage, setPrimaryLanguage] = useState(initialLanguages[0] || 'Spanish');
    const [secondaryLanguages, setSecondaryLanguages] = useState(initialLanguages.slice(1));

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || null);
    const fileInputRef = useRef(null);

    const initialGames = user?.stats?.length > 0 
        ? user.stats.map(stat => ({
            id: stat.id,
            gameId: stat.game_igdb_id,
            title: stat.game_name,
            cover: stat.cover_url || '',
            platform: stat.platform || 'PC',
            rank: stat.rank_tier,
            role: stat.role_main,
            searchResults: []
          }))
        : [{ id: Date.now(), gameId: null, title: '', cover: '', platform: 'PC', rank: '', role: '', searchResults: [] }];
        
    const [userGames, setUserGames] = useState(initialGames);

    const handleAvatarClick = () => fileInputRef.current.click();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const addGameRow = () => {
        setUserGames([...userGames, { id: Date.now(), gameId: null, title: '', cover: '', platform: 'PC', rank: '', role: '', searchResults: [] }]);
    };

    const removeGameRow = (idToRemove) => {
        setUserGames(userGames.filter(game => game.id !== idToRemove));
    };

    const handleGameChange = (id, field, value) => {
        setUserGames(userGames.map(game => 
            game.id === id ? { ...game, [field]: value } : game
        ));
    };

    const handleGameSearch = (id, query) => {
        setUserGames(userGames.map(game => 
            game.id === id ? { ...game, title: query } : game
        ));
    };

    const selectGame = (id, gameData) => {
        setUserGames(userGames.map(game => 
            game.id === id ? { 
                ...game, 
                gameId: gameData.gameId, 
                title: gameData.title, 
                cover: gameData.cover_url, 
                searchResults: []
            } : game
        ));
    };

    const resetGameSelection = (id) => {
        setUserGames(userGames.map(game => 
            game.id === id ? { 
                ...game, 
                gameId: null, 
                title: '', 
                cover: '', 
                searchResults: []
            } : game
        ));
    };

    const removeSecondaryLanguage = (lang) => {
        setSecondaryLanguages(secondaryLanguages.filter(l => l !== lang));
    };

    const addSecondaryLanguage = (e) => {
        const lang = e.target.value;
        if (lang && !secondaryLanguages.includes(lang) && lang !== primaryLanguage) {
            setSecondaryLanguages([...secondaryLanguages, lang]);
        }
        e.target.value = ''; 
    };

    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage(null);
        try {
            const formData = new FormData();
            formData.append('name', username);
            if (bio) formData.append('bio', bio);
            if (region) formData.append('region', region);

            const allLanguages = [primaryLanguage, ...secondaryLanguages].join(', ');
            formData.append('language', allLanguages);
            
            if (avatarFile) formData.append('avatar', avatarFile);

            const validGames = userGames.filter(g => g.gameId).map(g => ({
                ...g,
                cover_url: g.cover
            }));
            formData.append('games', JSON.stringify(validGames));

            const response = await api.post('/user/settings', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (updateUser && response.data.user) {
                updateUser(response.data.user);
            }
            setStatusMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (error) {
            console.error("Error updating profile:", error);
            setStatusMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
        }
    };

    const inputStyles = "w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors";

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-bold text-white mb-2">Profile Settings</h2>

            {statusMessage && (
                <div className={`mb-3 p-3 rounded-lg text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-red-500/20 border border-red-500 text-red-500'}`}>
                    {statusMessage.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">

                {}
                <div className="flex items-center gap-4 mb-1">
                    <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                        <div className="w-14 h-14 rounded-full bg-brand-red/20 border-2 border-brand-red flex items-center justify-center text-brand-red font-bold text-xl uppercase overflow-hidden">
                            {avatarPreview ? (
                                <img src={avatarPreview.startsWith('blob:') ? avatarPreview : `http://localhost:8000${avatarPreview}`} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                username.charAt(0) || 'S'
                            )}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={20} className="text-white" />
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
                        <button type="button" onClick={handleAvatarClick} className="flex items-center gap-2 text-sm text-white hover:text-gray-300 font-medium transition-colors">
                            <Camera size={14} /> Change Avatar
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputStyles}
                        />
                    </div>

                    {}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Region</label>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className={`${inputStyles} appearance-none`}
                        >
                            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>

                {}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Language</label>
                        <select
                            value={primaryLanguage}
                            onChange={(e) => setPrimaryLanguage(e.target.value)}
                            className={`${inputStyles} appearance-none`}
                        >
                            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Secondary Languages</label>
                        <select
                            onChange={addSecondaryLanguage}
                            className={`${inputStyles} appearance-none mb-3`}
                            defaultValue=""
                        >
                            <option value="" disabled>Add secondary language...</option>
                            {LANGUAGES.filter(l => l !== primaryLanguage && !secondaryLanguages.includes(l)).map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        
                        {secondaryLanguages.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {secondaryLanguages.map(lang => (
                                    <div key={lang} className="flex items-center gap-1.5 bg-brand-red/10 border border-brand-red/20 text-brand-red px-3 py-1.5 rounded-full text-xs font-medium shadow-sm transition-transform hover:scale-105">
                                        {lang}
                                        <button 
                                            type="button" 
                                            onClick={() => removeSecondaryLanguage(lang)} 
                                            className="hover:text-white transition-colors bg-brand-red/20 rounded-full p-0.5"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="2"
                        className={`${inputStyles} resize-none`}
                    ></textarea>
                </div>

                {}
                <div className="space-y-3 pt-3 border-t border-gray-800/60">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Games</label>
                    </div>

                    <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                        {userGames.map((game) => (
                            <div key={game.id} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 relative">
                                
                                {userGames.length > 1 && (
                                    <button 
                                        type="button" 
                                        onClick={() => removeGameRow(game.id)}
                                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}

                                {!game.gameId ? (
                                    
                                    <div className="space-y-2 pr-8">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Search for a Game</label>
                                        <GameSearchInput 
                                            value={game.title}
                                            onChange={(val) => handleGameSearch(game.id, val)}
                                            onSelect={(selectedGame) => selectGame(game.id, selectedGame)}
                                        />
                                    </div>
                                ) : (
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 pr-6">
                                            <img src={game.cover} alt={game.title} className="w-8 h-10 object-cover rounded shadow-sm" />
                                            <div>
                                                <h4 className="text-white font-bold">{game.title}</h4>
                                                <button 
                                                    type="button" 
                                                    onClick={() => resetGameSelection(game.id)}
                                                    className="text-xs text-brand-red hover:underline mt-1"
                                                >
                                                    Change Game
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Platform</label>
                                                <select
                                                    value={game.platform}
                                                    onChange={(e) => handleGameChange(game.id, 'platform', e.target.value)}
                                                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-red appearance-none"
                                                >
                                                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                                </select>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Rank / Level</label>
                                                <input
                                                    type="text"
                                                    value={game.rank}
                                                    onChange={(e) => handleGameChange(game.id, 'rank', e.target.value)}
                                                    placeholder="e.g. Diamond"
                                                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-red"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                    Role <span className="lowercase text-gray-500 font-normal">(optional)</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    value={game.role}
                                                    onChange={(e) => handleGameChange(game.id, 'role', e.target.value)}
                                                    placeholder="e.g. Entry, Support"
                                                    className="w-full bg-[#121212] border border-gray-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-brand-red"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button 
                        type="button"
                        onClick={addGameRow}
                        className="flex items-center gap-1 text-sm text-brand-red hover:text-[#ff4d4d] font-medium transition-colors mt-2"
                    >
                        <Plus size={16} /> Add Another Game
                    </button>
                </div>

                {}
                <div className="pt-3">
                    <button
                        type="submit"
                        className="flex items-center gap-2 bg-brand-red hover:bg-[#ff4d4d] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

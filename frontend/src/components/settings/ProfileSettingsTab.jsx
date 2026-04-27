import { useState, useRef } from 'react';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSettingsTab() {
    const { user, api, updateUser } = useAuth();

    const [username, setUsername] = useState(user?.name || 'Shadow');
    const [realName, setRealName] = useState('Alex Chen');
    const [bio, setBio] = useState('Professional Valorant player with 3+ years of competitive experience.');
    const [region, setRegion] = useState('North America');

    const [socials, setSocials] = useState({
        discord: 'Shadow#1234',
        twitter: '@shadow_val',
        twitch: 'shadow_plays',
        youtube: ''
    });

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

    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setSocials(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Implement save logic via api.post('/user/settings') or similar
    };

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-8">
            <h2 className="text-lg font-bold text-white mb-6">Profile Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative group cursor-pointer shrink-0" onClick={handleAvatarClick}>
                        <div className="w-20 h-20 rounded-full bg-brand-red/20 border-2 border-brand-red flex items-center justify-center text-brand-red font-bold text-2xl uppercase overflow-hidden">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                        />
                    </div>

                    {/* Real Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Real Name</label>
                        <input
                            type="text"
                            value={realName}
                            onChange={(e) => setRealName(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                        />
                    </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bio</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows="3"
                        className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors resize-none"
                    ></textarea>
                </div>

                {/* Region */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Region</label>
                    <select
                        value={region}
                        onChange={(e) => setRegion(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors appearance-none"
                    >
                        <option value="North America">North America</option>
                        <option value="Europe">Europe</option>
                        <option value="Asia">Asia</option>
                        <option value="South America">South America</option>
                        <option value="Oceania">Oceania</option>
                    </select>
                </div>

                {/* Social Links */}
                <div className="space-y-4 pt-4 border-t border-gray-800/60">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Social Links</label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Discord</label>
                            <input
                                type="text"
                                name="discord"
                                value={socials.discord}
                                onChange={handleSocialChange}
                                className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Twitter</label>
                            <input
                                type="text"
                                name="twitter"
                                value={socials.twitter}
                                onChange={handleSocialChange}
                                className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Twitch</label>
                            <input
                                type="text"
                                name="twitch"
                                value={socials.twitch}
                                onChange={handleSocialChange}
                                className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500">Youtube</label>
                            <input
                                type="text"
                                name="youtube"
                                placeholder="youtube URL or handle"
                                value={socials.youtube}
                                onChange={handleSocialChange}
                                className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="pt-6">
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

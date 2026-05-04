import { useState } from 'react';
import { Shield, Eye, Pencil, Trash2, Globe, UserPlus, X, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyTeams() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const initialProfiles = [
        { id: 1, name: 'Team A (Main Roster)', games: 3, language: 'Spanish', status: 'Active' },
        { id: 2, name: 'Team B (Junior)', games: 1, language: 'Spanish', status: 'Active' },
        { id: 3, name: 'Valorant Regional - EU', games: 1, language: 'English', status: 'Disabled' },
    ];
    const [teamProfiles] = useState(initialProfiles);

    const [editingProfile, setEditingProfile] = useState({
        name: 'Team A',
        country: 'Spain',
        language: 'Spanish',
        recruitment: 'Looking for players'
    });

    return (
        <div className="space-y-10">

            <div className="bg-[#121212] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">

                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Shield className="text-brand-red" size={28} />
                            My Team Profiles
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Manage and edit your team profiles for different rosters and games.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-brand-red hover:bg-[#FF4D4D] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-[0_0_15px_rgba(255,51,51,0.2)]"
                    >
                        <UserPlus size={18} />
                        Add New Profile
                    </button>
                </div>

                <table className="w-full text-sm">
                    <thead className="text-gray-500 uppercase font-bold text-xs bg-[#0f0f0f] border-b border-gray-800">
                        <tr>
                            <th className="px-6 py-4 text-left">Profile Name</th>
                            <th className="px-6 py-4 text-center">Games</th>
                            <th className="px-6 py-4 text-center">Language</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                        {teamProfiles.map((profile) => (
                            <tr key={profile.id} className="hover:bg-[#1a1a1a] transition-colors">
                                <td className="px-6 py-5 font-medium text-white flex items-center gap-3">
                                    <Shield size={16} className="text-brand-red/60" />
                                    {profile.name}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className="bg-gray-800 px-2 py-1 rounded text-xs">{profile.games} Games</span>
                                </td>
                                <td className="px-6 py-5 text-center flex items-center justify-center gap-2 text-gray-400">
                                    <Globe size={14} />
                                    {profile.language}
                                </td>
                                <td className="px-6 py-5 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${profile.status === 'Active'
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-gray-700 text-gray-400'
                                        }`}>
                                        {profile.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right space-x-2">
                                    <button onClick={() => navigate('/dashboard/team-profile')} className="text-gray-500 hover:text-white p-2 rounded-md hover:bg-gray-800 transition-colors"><Eye size={16} /></button>
                                    <button onClick={() => setIsModalOpen(true)} className="text-brand-red hover:text-[#FF4D4D] p-2 rounded-md hover:bg-brand-red/10 transition-colors"><Pencil size={16} /></button>
                                    <button className="text-gray-600 hover:text-red-500 p-2 rounded-md hover:bg-red-500/10 transition-colors"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">

                <div className="lg:col-span-2 space-y-8">

                    <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            <Shield size={18} className="text-brand-red" />
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Profile Name</label>
                                <input
                                    type="text"
                                    value={editingProfile.name}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Recruitment Status</label>
                                <select
                                    value={editingProfile.recruitment}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, recruitment: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors appearance-none"
                                >
                                    <option value="Looking for players">Looking for players</option>
                                    <option value="Not looking">Not looking</option>
                                    <option value="Only trials">Only trials</option>
                                </select>
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Country</label>
                                <MapPin className="absolute left-3 top-9 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={editingProfile.country}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, country: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Language</label>
                                <Globe className="absolute left-3 top-9 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    value={editingProfile.language}
                                    onChange={(e) => setEditingProfile({ ...editingProfile, language: e.target.value })}
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 mt-6 border-t border-gray-800 pt-6">
                            <label className="text-xs text-gray-400 uppercase font-bold tracking-wider">Description</label>
                            <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-sm text-gray-600 min-h-[150px]">
                                WYSIWYG Editor Placeholder (Fase 2)
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 shadow-xl opacity-60">
                        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                            Social Links
                        </h2>
                        <p className="text-sm text-gray-500">Social link inputs will go here in Phase 2.</p>
                    </div>

                </div>

                <div className="bg-[#121212] border border-gray-800 rounded-2xl p-6 shadow-xl opacity-60 h-fit">
                    <h2 className="text-lg font-bold text-white mb-6">Games & Rosters</h2>
                    <p className="text-sm text-gray-500">The dynamic games/rosters manager will go here in Phase 2.</p>
                </div>

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#121212] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in-down">

                        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">Add New Profile</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-gray-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Team Profile Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Valorant Regional, League of Legends EU..."
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-700"
                                />
                                <p className="text-xs text-gray-500">This name will help you distinguish between your different team rosters.</p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-800 bg-[#0f0f0f] flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-sm text-gray-400 hover:text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button className="bg-brand-red hover:bg-[#FF4D4D] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all">
                                Create Profile
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
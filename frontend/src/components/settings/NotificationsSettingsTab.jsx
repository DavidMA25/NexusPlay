import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const defaults = {
    teamInvites: true,
    messages: true,
};

export default function NotificationsSettingsTab() {
    const { user, api, loadUser } = useAuth();
    const [toggles, setToggles] = useState(defaults);
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.notification_preferences) {
            setToggles({ ...defaults, ...user.notification_preferences });
        }
    }, [user]);

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.put('/user/notifications', { preferences: toggles });
            setSaved(true);
            loadUser(); 
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            console.error('Error saving preferences', e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-6">Notification Preferences</h2>

            <div className="space-y-6">
                {[
                    { key: 'teamInvites', label: 'Team Invites' },
                    { key: 'messages', label: 'Messages' },
                ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">{item.label}</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={toggles[item.key]}
                                onChange={() => handleToggle(item.key)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                    </div>
                ))}

                <div className="pt-4 flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 bg-brand-red hover:bg-[#ff4d4d] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)] disabled:opacity-50"
                    >
                        <Save size={16} /> {loading ? 'Saving...' : 'Save Preferences'}
                    </button>
                    {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
                </div>
            </div>
        </div>
    );
}

import { useState } from 'react';
import { Save } from 'lucide-react';

export default function NotificationsSettingsTab() {
    const [toggles, setToggles] = useState({
        teamInvites: true,
        matchRequests: true,
        messages: true,
        events: true,
        achievements: true
    });

    const handleToggle = (key) => {
        setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-8">
            <h2 className="text-lg font-bold text-white mb-6">Notification Preferences</h2>

            <div className="space-y-6">

                {[
                    { key: 'teamInvites', label: 'Team Invites' },
                    { key: 'matchRequests', label: 'Match Requests' },
                    { key: 'messages', label: 'Messages' },
                    { key: 'events', label: 'Events' },
                    { key: 'achievements', label: 'Achievements' },
                ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-white">{item.label}</p>
                        </div>
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

                <div className="pt-4">
                    <button className="flex items-center gap-2 bg-brand-red hover:bg-[#ff4d4d] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]">
                        <Save size={16} /> Save Preferences
                    </button>
                </div>

            </div>
        </div>
    );
}

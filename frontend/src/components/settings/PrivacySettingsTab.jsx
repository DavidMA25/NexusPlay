import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';

const STORAGE_KEY = 'nexusplay_privacy_settings';

const defaults = {
    visibility: 'Public',
    showOnline: true,
    showActivity: true,
    whoCanMessage: 'Everyone',
};

export default function PrivacySettingsTab() {
    const [settings, setSettings] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
        } catch {
            return defaults;
        }
    });
    const [saved, setSaved] = useState(false);

    const update = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));

    const handleSave = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-6">Privacy Settings</h2>

            <div className="space-y-8">
                {/* Profile Visibility */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Visibility</label>
                    <div className="flex bg-[#1a1a1a] rounded-lg p-1 w-full max-w-lg">
                        {['Public', 'Private', 'Friends'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => update('visibility', tab)}
                                className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${settings.visibility === tab
                                    ? 'bg-brand-red text-white shadow-md'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-800/60" />

                {/* Toggles */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">Show Online Status</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.showOnline} onChange={() => update('showOnline', !settings.showOnline)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">Show Game Activity</p>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={settings.showActivity} onChange={() => update('showActivity', !settings.showActivity)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                    </div>
                </div>

                <hr className="border-gray-800/60" />

                {/* Who can message me */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Who can message me</label>
                    <select
                        value={settings.whoCanMessage}
                        onChange={(e) => update('whoCanMessage', e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors appearance-none"
                    >
                        <option value="Everyone">Everyone</option>
                        <option value="Friends Only">Friends Only</option>
                        <option value="No One">No One</option>
                    </select>
                </div>

                <div className="pt-2 flex items-center gap-4">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-brand-red hover:bg-[#ff4d4d] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]"
                    >
                        <Save size={16} /> Save Preferences
                    </button>
                    {saved && <span className="text-green-400 text-sm">✓ Saved</span>}
                </div>
            </div>
        </div>
    );
}

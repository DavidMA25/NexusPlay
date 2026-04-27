import { useState } from 'react';
import { Save } from 'lucide-react';

export default function PrivacySettingsTab() {
    const [visibility, setVisibility] = useState('Public');
    const [showOnline, setShowOnline] = useState(true);
    const [showActivity, setShowActivity] = useState(true);
    const [whoCanMessage, setWhoCanMessage] = useState('Everyone');

    return (
        <div className="bg-[#121212] border border-gray-800 rounded-xl p-8">
            <h2 className="text-lg font-bold text-white mb-6">Privacy Settings</h2>

            <div className="space-y-8">
                {/* Profile Visibility */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Profile Visibility</label>
                    <div className="flex bg-[#1a1a1a] rounded-lg p-1 w-full max-w-lg">
                        {['Public', 'Private', 'Friends'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setVisibility(tab)}
                                className={`flex-1 text-sm font-medium py-2 rounded-md transition-all ${visibility === tab
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
                        <div>
                            <p className="text-sm font-bold text-white">Show Online Status</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={showOnline} onChange={() => setShowOnline(!showOnline)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-white">Show Game Activity</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={showActivity} onChange={() => setShowActivity(!showActivity)} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                        </label>
                    </div>
                </div>

                <hr className="border-gray-800/60" />

                {/* Who can message me */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Who can message me</label>
                    <select
                        value={whoCanMessage}
                        onChange={(e) => setWhoCanMessage(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-transparent hover:border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors appearance-none"
                    >
                        <option value="Everyone">Everyone</option>
                        <option value="Friends Only">Friends Only</option>
                        <option value="No One">No One</option>
                    </select>
                </div>

                {/* Save button */}
                <div className="pt-4">
                    <button className="flex items-center gap-2 bg-brand-red hover:bg-[#ff4d4d] text-white px-6 py-2.5 rounded-md text-sm font-medium transition-all shadow-[0_0_10px_rgba(255,51,51,0.2)] hover:shadow-[0_0_15px_rgba(255,51,51,0.4)]">
                        <Save size={16} /> Save Preferences
                    </button>
                </div>

            </div>
        </div>
    );
}

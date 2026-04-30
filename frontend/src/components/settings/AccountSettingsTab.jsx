import { useAuth } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

export default function AccountSettingsTab() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="bg-[#121212] border border-gray-800 rounded-xl p-8">
                <h2 className="text-lg font-bold text-white mb-6">Account Settings</h2>

                <div className="space-y-6">
                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <input
                                type="text"
                                disabled
                                value={user?.email || ''}
                                className="w-full bg-[#1a1a1a] border border-transparent rounded-lg pl-4 pr-20 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                Verified
                            </span>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div>
                        <button className="bg-transparent hover:bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Change Password
                        </button>
                    </div>

                    <hr className="border-gray-800/60" />

                    {/* 2FA */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-white">Two-Factor Authentication</p>
                            <p className="text-xs text-gray-400">Add an extra layer of security</p>
                        </div>
                        <button className="bg-brand-red hover:bg-[#ff4d4d] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                            Enable
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-transparent border border-red-500/30 rounded-xl p-8 shadow-[inset_0_0_20px_rgba(255,51,51,0.05)]">
                <h2 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h2>
                <p className="text-xs text-gray-400 mb-4">Once you delete your account, there is no going back.</p>

                <button className="flex items-center gap-2 bg-transparent hover:bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    <Trash2 size={16} /> Delete Account
                </button>
            </div>
        </div>
    );
}

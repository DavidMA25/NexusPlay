import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trash2, X } from 'lucide-react';

export default function AccountSettingsTab() {
    const { user, api, logout } = useAuth();
    
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [emailForm, setEmailForm] = useState({ email: user?.email || '', current_password: '' });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleEmailChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await api.put('/user/email', emailForm);
            setSuccessMessage('Email updated successfully.');
            setTimeout(() => {
                setIsEmailModalOpen(false);
                setSuccessMessage(null);
                
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating email');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await api.put('/user/password', passwordForm);
            setSuccessMessage('Password updated successfully.');
            setTimeout(() => {
                setIsPasswordModalOpen(false);
                setSuccessMessage(null);
                setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating password');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setLoading(true);
        setError(null);
        try {
            await api.delete('/user/account');
            await logout(); 
        } catch (err) {
            setError(err.response?.data?.message || 'Error deleting account');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-[#121212] border border-gray-800 rounded-xl p-8">
                <h2 className="text-lg font-bold text-white mb-6">Account Settings</h2>

                <div className="space-y-6">
                    {}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email</label>
                        <div className="flex gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    disabled
                                    value={user?.email || ''}
                                    className="w-full bg-[#1a1a1a] border border-transparent rounded-lg pl-4 pr-20 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                                />
                                {user?.email_verified && (
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded">
                                        Verified
                                    </span>
                                )}
                            </div>
                            <button 
                                onClick={() => setIsEmailModalOpen(true)}
                                className="bg-transparent hover:bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Change
                            </button>
                        </div>
                    </div>

                    <hr className="border-gray-800/60" />

                    {}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-white">Password</p>
                            <p className="text-xs text-gray-400">Update your account password</p>
                        </div>
                        <button 
                            onClick={() => setIsPasswordModalOpen(true)}
                            className="bg-transparent hover:bg-gray-800 border border-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Change Password
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-transparent border border-red-500/30 rounded-xl p-8 shadow-[inset_0_0_20px_rgba(255,51,51,0.05)]">
                <h2 className="text-sm font-bold text-red-500 mb-2">Danger Zone</h2>
                <p className="text-xs text-gray-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>

                <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-2 bg-transparent hover:bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    <Trash2 size={16} /> Delete Account
                </button>
            </div>

            {}
            {isEmailModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#121212] border border-gray-800 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-800">
                            <h3 className="text-lg font-bold text-white">Change Email Address</h3>
                            <button onClick={() => {setIsEmailModalOpen(false); setError(null);}} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEmailChange} className="p-5 space-y-4">
                            {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">{error}</div>}
                            {successMessage && <div className="bg-green-500/10 text-green-500 p-3 rounded-md text-sm border border-green-500/20">{successMessage}</div>}
                            
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">New Email</label>
                                <input
                                    type="email"
                                    required
                                    value={emailForm.email}
                                    onChange={(e) => setEmailForm({...emailForm, email: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={emailForm.current_password}
                                    onChange={(e) => setEmailForm({...emailForm, current_password: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsEmailModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-red hover:bg-[#ff4d4d] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#121212] border border-gray-800 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-800">
                            <h3 className="text-lg font-bold text-white">Change Password</h3>
                            <button onClick={() => {setIsPasswordModalOpen(false); setError(null);}} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordChange} className="p-5 space-y-4">
                            {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20">{error}</div>}
                            {successMessage && <div className="bg-green-500/10 text-green-500 p-3 rounded-md text-sm border border-green-500/20">{successMessage}</div>}
                            
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwordForm.current_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, current_password: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordForm.new_password}
                                    onChange={(e) => setPasswordForm({...passwordForm, new_password: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={passwordForm.new_password_confirmation}
                                    onChange={(e) => setPasswordForm({...passwordForm, new_password_confirmation: e.target.value})}
                                    className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-red transition-colors"
                                />
                            </div>
                            <div className="pt-2 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-brand-red hover:bg-[#ff4d4d] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50">
                                    {loading ? 'Saving...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-[#121212] border border-red-500/50 rounded-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-5 border-b border-gray-800">
                            <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                                <Trash2 size={20} /> Delete Account
                            </h3>
                            <button onClick={() => setIsDeleteModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-5">
                            {error && <div className="bg-red-500/10 text-red-500 p-3 rounded-md text-sm border border-red-500/20 mb-4">{error}</div>}
                            
                            <p className="text-gray-300 text-sm mb-4">
                                Are you sure you want to permanently delete your account? This action cannot be undone and will remove all your data, profile, and team associations.
                            </p>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    onClick={() => setIsDeleteModalOpen(false)} 
                                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteAccount} 
                                    disabled={loading} 
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete Account'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

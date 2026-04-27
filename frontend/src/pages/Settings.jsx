import { useState } from 'react';
import { User, Shield, Lock, Bell, Palette, Link as LinkIcon } from 'lucide-react';
import ProfileSettingsTab from '../components/settings/ProfileSettingsTab';
import AccountSettingsTab from '../components/settings/AccountSettingsTab';
import PrivacySettingsTab from '../components/settings/PrivacySettingsTab';
import NotificationsSettingsTab from '../components/settings/NotificationsSettingsTab';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={16} />, disabled: false },
        { id: 'account', label: 'Account', icon: <Shield size={16} />, disabled: false },
        { id: 'privacy', label: 'Privacy', icon: <Lock size={16} />, disabled: false },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} />, disabled: false },
        { id: 'appearance', label: 'Appearance', icon: <Palette size={16} />, disabled: true },
        { id: 'connections', label: 'Connections', icon: <LinkIcon size={16} />, disabled: true }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettingsTab />;
            case 'account':
                return <AccountSettingsTab />;
            case 'privacy':
                return <PrivacySettingsTab />;
            case 'notifications':
                return <NotificationsSettingsTab />;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 pb-10 mt-6">
            
            {/* Sidebar de Settings */}
            <aside className="w-full md:w-56 shrink-0">
                <h1 className="text-2xl font-bold text-white mb-6 pl-4 border-b border-transparent">Settings</h1>
                
                <nav className="flex flex-col space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                            disabled={tab.disabled}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-brand-red/10 text-brand-red'
                                    : tab.disabled
                                        ? 'text-gray-600 cursor-not-allowed'
                                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Contenido Principal de Settings */}
            <main className="flex-1 mt-14">
                {renderTabContent()}
            </main>
        </div>
    );
}

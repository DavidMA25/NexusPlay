import { useState } from 'react';
import { User, Shield, Bell } from 'lucide-react';
import ProfileSettingsTab from '../components/settings/ProfileSettingsTab';
import AccountSettingsTab from '../components/settings/AccountSettingsTab';
import NotificationsSettingsTab from '../components/settings/NotificationsSettingsTab';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={16} /> },
        { id: 'account', label: 'Account', icon: <Shield size={16} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettingsTab />;
            case 'account':
                return <AccountSettingsTab />;
            case 'notifications':
                return <NotificationsSettingsTab />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 pb-10">

            {/* Sidebar de Settings */}
            <aside className="w-full md:w-44 shrink-0">
                <h1 className="text-2xl font-bold text-white mb-4 pl-4">Settings</h1>

                <nav className="flex flex-col space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-brand-red/10 text-brand-red'
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
            <main className="flex-1 min-w-0">
                {renderTabContent()}
            </main>
        </div>
    );
}

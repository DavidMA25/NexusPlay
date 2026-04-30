import { useState } from 'react';
import { Search, Info, MoreVertical, Smile, Paperclip, Send } from 'lucide-react';

export default function Messages() {
    const [activeTab, setActiveTab] = useState('All');

    const conversations = [
        {
            id: 1,
            name: 'Shadow',
            avatar: 'S', // Placeholder, ideally use images if available
            avatarBg: 'bg-yellow-500',
            lastMessage: 'Ready for scrims tonight?',
            time: '2m ago',
            unread: 2,
            online: true,
            active: true
        },
        {
            id: 2,
            name: 'Phoenix Squad',
            avatar: 'P',
            avatarBg: 'bg-orange-500',
            lastMessage: 'Team meeting at 7pm EST',
            time: '15m ago',
            unread: 5,
            online: true,
            active: false
        },
        {
            id: 3,
            name: 'Viper',
            avatar: 'V',
            avatarBg: 'bg-gray-600',
            lastMessage: 'GG well played!',
            time: '1h ago',
            unread: 0,
            online: false,
            active: false
        },
        {
            id: 4,
            name: 'Nova',
            avatar: 'N',
            avatarBg: 'bg-blue-500',
            lastMessage: 'Can you review my VOD?',
            time: '3h ago',
            unread: 1,
            online: true,
            active: false
        },
        {
            id: 5,
            name: 'Thunder',
            avatar: 'T',
            avatarBg: 'bg-yellow-600',
            lastMessage: 'See you at the tournament',
            time: '1d ago',
            unread: 0,
            online: false,
            active: false
        }
    ];

    return (
        <div className="flex h-full w-full bg-[#0a0a0a] text-white overflow-hidden rounded-xl border border-gray-800">
            {/* Left Sidebar - Conversations */}
            <div className="w-80 border-r border-gray-800 flex flex-col bg-[#0f0f0f]">
                {/* Header */}
                <div className="p-5 border-b border-gray-800">
                    <h2 className="text-xl font-bold mb-4">Messages</h2>
                    
                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-500"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 text-sm">
                        {['All', 'Players', 'Teams'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1 rounded-full transition-colors ${
                                    activeTab === tab 
                                        ? 'bg-brand-red text-white' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {conversations.map(conv => (
                        <div 
                            key={conv.id} 
                            className={`relative flex items-center gap-3 p-4 cursor-pointer hover:bg-[#1a1a1a] transition-colors ${
                                conv.active ? 'bg-[#1a1a1a]' : ''
                            }`}
                        >
                            {/* Active indicator line */}
                            {conv.active && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red"></div>
                            )}

                            {/* Avatar */}
                            <div className="relative">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${conv.avatarBg}`}>
                                    {conv.avatar}
                                </div>
                                {conv.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-medium text-sm truncate">{conv.name}</h3>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{conv.time}</span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">{conv.lastMessage}</p>
                            </div>

                            {/* Unread Badge */}
                            {conv.unread > 0 && (
                                <div className="w-5 h-5 bg-brand-red rounded-full flex items-center justify-center text-[10px] font-bold">
                                    {conv.unread}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Chat Area */}
            <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                {/* Chat Header */}
                <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-[#0f0f0f]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold">
                            S
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Shadow</h3>
                            <p className="text-xs text-gray-400">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-gray-400">
                        <button className="hover:text-white transition-colors">
                            <Info size={20} />
                        </button>
                        <button className="hover:text-white transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Message from them */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0 flex items-center justify-center font-bold text-sm mt-1">
                            S
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-medium text-sm">Shadow</span>
                            </div>
                            <div className="bg-[#1a1a1a] text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm max-w-[80%] border border-gray-800/50">
                                Hey, are you free tonight?
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1">10:30 AM</span>
                        </div>
                    </div>

                    {/* Message from me */}
                    <div className="flex flex-col items-end">
                        <div className="bg-brand-red/20 text-white border border-brand-red/30 px-4 py-2.5 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                            Yeah, I should be available around 8pm
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">10:32 AM</span>
                    </div>

                    {/* Message from them */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0 flex items-center justify-center font-bold text-sm mt-1">
                            S
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-medium text-sm">Shadow</span>
                            </div>
                            <div className="bg-[#1a1a1a] text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm max-w-[80%] border border-gray-800/50">
                                Perfect! We need to practice the new lineup on Ascent
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1">10:33 AM</span>
                        </div>
                    </div>

                    {/* Message from me */}
                    <div className="flex flex-col items-end">
                        <div className="bg-brand-red/20 text-white border border-brand-red/30 px-4 py-2.5 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                            Sounds good, I've been working on some smokes
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1">10:35 AM</span>
                    </div>

                    {/* Message from them */}
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0 flex items-center justify-center font-bold text-sm mt-1">
                            S
                        </div>
                        <div className="flex flex-col items-start">
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="font-medium text-sm">Shadow</span>
                            </div>
                            <div className="bg-[#1a1a1a] text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none text-sm max-w-[80%] border border-gray-800/50">
                                Ready for scrims tonight?
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1">2:00 PM</span>
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#0a0a0a] border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <button className="text-gray-500 hover:text-white transition-colors">
                            <Smile size={20} />
                        </button>
                        
                        <div className="flex-1">
                            <input 
                                type="text" 
                                placeholder="Type a message..." 
                                className="w-full bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600"
                            />
                        </div>
                        
                        <button className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center hover:bg-[#FF4D4D] transition-colors shadow-[0_0_10px_rgba(255,51,51,0.2)]">
                            <Send size={18} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

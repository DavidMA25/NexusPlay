import { useState, useEffect, useRef, useCallback } from 'react';
import {
    Search, Info, Send, Users, X,
    Plus, Trash2, ChevronLeft, Hash, MessageSquare, Shield
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useEcho } from '../hooks/useEcho';
import GameSearchInput from '../components/GameSearchInput';

function formatTime(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffDays = Math.floor((now - d) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7)  return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
}

function Avatar({ name, avatarUrl, size = 'md', isGroup = false }) {
    const sizeMap = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
    const initial = (name ?? '?').charAt(0).toUpperCase();
    const base = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:8000';
    
    return (
        <div className={`${sizeMap[size]} rounded-full bg-[#222] border border-gray-700 flex items-center justify-center font-bold text-gray-400 overflow-hidden flex-shrink-0`}>
            {avatarUrl 
                ? <img src={avatarUrl.startsWith('http') ? avatarUrl : `${base}${avatarUrl}`} alt={name} className="w-full h-full object-cover" /> 
                : (isGroup ? <Hash size={size === 'sm' ? 12 : 16} /> : initial)
            }
        </div>
    );
}



function CreateTeamModal({ onClose, onCreated }) {
    const { api } = useAuth();
    const { conversations } = useChat();
    const [formData, setFormData] = useState({
        name: '', region: 'Europe', language: 'English', game: '', game_igdb_id: '', platform: 'PC', description: ''
    });
    const [logo, setLogo] = useState(null);
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const eligible = conversations
        .filter(c => !c.is_group && c.other_user_id)
        .map(c => ({ id: c.other_user_id, name: c.name, avatar_url: c.avatar_url }));

    const toggle = (u) => setSelected(prev =>
        prev.find(s => s.id === u.id) ? prev.filter(s => s.id !== u.id) : [...prev, u]
    );

    const handleCreate = async () => {
        if (!formData.name.trim() || !formData.game_igdb_id) {
            setError('Name and Game are required.');
            return;
        }
        setLoading(true); setError('');
        
        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (logo) data.append('logo', logo);
            if (selected.length > 0) data.append('members', JSON.stringify(selected.map(u => u.id)));

            await api.post('/teams', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onCreated();
            onClose();
        } catch (e) {
            setError(e.response?.data?.message ?? 'Error creating team.');
        } finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="w-full max-w-md bg-[#121212] border border-gray-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-5 border-b border-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-brand-red/10 flex items-center justify-center">
                            <Shield size={18} className="text-brand-red" />
                        </div>
                        <h3 className="font-bold text-white">Create Esport Team</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
                </div>
                
                <div className="p-5 space-y-4 overflow-y-auto flex-1">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl border border-dashed border-gray-700 flex flex-col items-center justify-center text-gray-500 overflow-hidden relative group">
                            {logo ? (
                                <img src={URL.createObjectURL(logo)} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-[10px]">Logo</span>
                            )}
                            <input type="file" accept="image/*" onChange={e => setLogo(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="flex-1">
                            <input type="text" placeholder="Team Name *"
                                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <select value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red">
                            <option value="Europe">Europe</option>
                            <option value="North America">North America</option>
                            <option value="South America">South America</option>
                            <option value="Asia">Asia</option>
                        </select>
                        <select value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})} className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red">
                            <option value="English">English</option>
                            <option value="Spanish">Spanish</option>
                            <option value="French">French</option>
                            <option value="German">German</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg focus-within:border-brand-red flex items-center">
                            <GameSearchInput 
                                value={formData.game}
                                onChange={v => setFormData({...formData, game: v})}
                                onSelect={g => setFormData({...formData, game: g.title, game_igdb_id: g.gameId})}
                            />
                        </div>
                        <select value={formData.platform} onChange={e => setFormData({...formData, platform: e.target.value})} className="bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red">
                            <option value="PC">PC</option>
                            <option value="PlayStation">PlayStation</option>
                            <option value="Xbox">Xbox</option>
                            <option value="Mobile">Mobile</option>
                            <option value="Crossplay">Crossplay</option>
                        </select>
                    </div>

                    <textarea placeholder="Description (optional)" rows={2}
                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                        className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red resize-none" />

                    <div className="pt-2">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Invite Members (Optional)</p>
                        {eligible.length === 0 ? (
                            <p className="text-xs text-gray-600 italic">No direct contacts to invite.</p>
                        ) : (
                            <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                                {eligible.map(u => {
                                    const sel = selected.find(s => s.id === u.id);
                                    return (
                                        <button key={u.id} onClick={() => toggle(u)}
                                            className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors text-left border ${sel ? 'bg-brand-red/10 border-brand-red/30' : 'hover:bg-[#1a1a1a] border-transparent'}`}>
                                            <Avatar name={u.name} avatarUrl={u.avatar_url} size="sm" />
                                            <span className="text-xs text-white">{u.name}</span>
                                            {sel && <div className="ml-auto w-3 h-3 rounded-full bg-brand-red flex items-center justify-center text-[8px] text-white font-bold">✓</div>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {error && <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
                </div>
                
                <div className="p-5 border-t border-gray-800 flex-shrink-0">
                    <button onClick={handleCreate} disabled={!formData.name.trim() || !formData.game_igdb_id || loading}
                        className="w-full bg-brand-red hover:bg-[#FF4D4D] disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-all">
                        {loading ? 'Creating...' : `Create Team`}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ChatPanel({ conversation, onBack, initialInputText = '' }) {
    const { user, api, token } = useAuth();
    const echo = useEcho(token);

    const [messages, setMessages] = useState([]);
    const [loadingMsgs, setLoadingMsgs] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [inputText, setInputText] = useState(initialInputText);
    const [sending, setSending] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const { removeConversation } = useChat();

    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    const fetchMessages = useCallback(async (p = 1) => {
        try {
            if (p === 1) setLoadingMsgs(true);
            const res = await api.get(`/conversations/${conversation.id}/messages?page=${p}`);
            const data = res.data.data ?? res.data;
            const meta = res.data.meta;
            setMessages(prev => p === 1 ? data : [...data, ...prev]);
            setHasMore(meta ? meta.current_page < meta.last_page : false);
            setPage(p);
        } catch (e) {
            console.error('Error cargando mensajes:', e);
        } finally { setLoadingMsgs(false); }
    }, [api, conversation.id]);

    useEffect(() => {
        setMessages([]); setPage(1);
        fetchMessages(1);
        inputRef.current?.focus();
    }, [conversation.id]);

    useEffect(() => {
        if (!loadingMsgs) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [loadingMsgs, messages.length]);

    // me suscribo al canal de esta conversacion para recibir mensajes en tiempo real
    useEffect(() => {
        if (!echo) return;
        const channelName = `conversation.${conversation.id}`;
        const channel = echo.private(channelName);

        channel
            .listen('.message.sent', data => {
                setMessages(prev => {
                    // Si ya existe el mensaje real (id numérico), ignorar
                    if (prev.find(m => m.id === data.id)) return prev;

                    const newMsg = {
                        id: data.id, conversation_id: data.conversation_id,
                        sender_id: data.sender_id, content: data.content,
                        deleted_at: null, created_at: data.created_at,
                        sender: { 
                            id: data.sender_id, 
                            name: data.sender_name, 
                            nickname: data.sender_nickname,
                            avatar_url: data.sender_avatar 
                        },
                    };

                    // Si es mensaje propio: reemplazar el optimistic (opt-*) pendiente
                    // para evitar duplicados
                    const optimisticIdx = prev.findIndex(
                        m => String(m.id).startsWith('opt-') && String(m.sender_id) === String(data.sender_id)
                    );
                    if (optimisticIdx !== -1) {
                        const next = [...prev];
                        next[optimisticIdx] = newMsg;
                        return next;
                    }

                    return [...prev, newMsg];
                });
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                if (data.sender_id !== user?.id) {
                    api.post(`/conversations/${conversation.id}/read`).catch(() => {});
                }
            })
            .listen('.message.deleted', data => {
                setMessages(prev => prev.map(m =>
                    m.id === data.id ? { ...m, content: '', deleted_at: new Date().toISOString() } : m
                ));
            });

        api.post(`/conversations/${conversation.id}/read`).catch(() => {});

        return () => { echo.leave(channelName); };
    }, [echo, conversation.id, user?.id]);

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || sending) return;
        setSending(true); setInputText('');
        // muestro el mensaje ya en pantalla sin esperar al servidor, si falla lo quito
        const optId = `opt-${Date.now()}`;
        const optimistic = {
            id: optId, conversation_id: conversation.id,
            sender_id: user.id, content: text,
            deleted_at: null, created_at: new Date().toISOString(),
            sender: { id: user.id, name: user.nickname ?? user.name, avatar_url: user.avatar_url },
        };
        setMessages(prev => [...prev, optimistic]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30);
        try {
            const res = await api.post(`/conversations/${conversation.id}/messages`, { content: text });
            setMessages(prev => prev.map(m => m.id === optId ? res.data : m));
        } catch (e) {
            console.error(e);
            setMessages(prev => prev.filter(m => m.id !== optId));
            setInputText(text);
        } finally { setSending(false); inputRef.current?.focus(); }
    };

    const handleDelete = async (msgId) => {
        try {
            await api.delete(`/conversations/${conversation.id}/messages/${msgId}`);
        } catch (e) { console.error(e); }
    };

    const isGroupOwner = conversation.is_group && conversation.owner_id === user?.id;

    const handleLeaveGroup = async () => {
        if (!window.confirm("Are you sure you want to leave this team chat?")) return;
        try {
            await api.post(`/conversations/${conversation.id}/leave`);
            removeConversation(conversation.id);
            onBack();
        } catch (e) {
            console.error("Error leaving group", e);
            alert(e.response?.data?.message || "Error leaving group");
        }
    };

    const renderMsg = (msg, idx, arr) => {
        const isMe = String(msg.sender_id) === String(user?.id);
        const isDeleted = !!msg.deleted_at;
        const showAvatar = !isMe && (idx === 0 || arr[idx - 1]?.sender_id !== msg.sender_id);
        const showName = conversation.is_group && !isMe && showAvatar;
        const canDelete = !isDeleted && (isMe || (isGroupOwner && !isMe));

        return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'gap-2'}`}>
                {!isMe && (
                    <div className="w-8 flex-shrink-0 mt-1">
                        {showAvatar && <Avatar name={msg.sender?.nickname ?? msg.sender?.name} avatarUrl={msg.sender?.avatar_url} size="sm" />}
                    </div>
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {showName && <span className="text-[11px] text-gray-400 mb-0.5 ml-1">{msg.sender?.nickname ?? msg.sender?.name}</span>}
                    <div className="relative group">
                        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isDeleted ? 'bg-[#1a1a1a] text-gray-600 italic border border-gray-800/50' :
                            isMe ? 'bg-brand-red/20 text-white border border-brand-red/30 rounded-tr-none' :
                            'bg-[#1a1a1a] text-gray-200 border border-gray-800/50 rounded-tl-none'
                        }`}>
                            {isDeleted ? 'Mensaje eliminado' : msg.content}
                        </div>
                        {canDelete && (
                            <button onClick={() => handleDelete(msg.id)}
                                className={`absolute top-1/2 -translate-y-1/2 ${isMe ? '-left-7' : '-right-7'} opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-500`}
                                title="Delete">
                                <Trash2 size={13} />
                            </button>
                        )}
                    </div>
                    <span className="text-[10px] text-gray-600 mt-0.5 px-1">{formatTime(msg.created_at)}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col bg-[#0a0a0a] min-h-0">
            {/* Header */}
            <div className="h-16 border-b border-gray-800 flex items-center justify-between px-5 bg-[#0f0f0f] flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="md:hidden text-gray-400 hover:text-white mr-1"><ChevronLeft size={20} /></button>
                    {conversation.is_group
                        ? <div className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center"><Hash size={18} className="text-gray-400" /></div>
                        : <Avatar name={conversation.name} avatarUrl={conversation.avatar_url} />
                    }
                    <div>
                        <h3 className="font-bold text-sm text-white">{conversation.name}</h3>
                        {conversation.is_group && <p className="text-xs text-gray-500">{conversation.participants?.length ?? 0} members</p>}
                    </div>
                </div>
                <button onClick={() => setShowInfo(v => !v)} className={`hover:text-white transition-colors ${showInfo ? 'text-white' : 'text-gray-500'}`} title="Info">
                    <Info size={19} />
                </button>
            </div>

            <div className="flex flex-1 min-h-0">
                {/* Messages */}
                <div className="flex-1 flex flex-col min-h-0">
                    {hasMore && (
                        <div className="text-center p-2 flex-shrink-0">
                            <button onClick={() => fetchMessages(page + 1)} className="text-xs text-brand-red hover:underline">
                                Load previous
                            </button>
                        </div>
                    )}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                        {loadingMsgs ? (
                            <div className="flex items-center justify-center h-32">
                                <div className="w-6 h-6 border-2 border-brand-red/30 border-t-brand-red rounded-full animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-gray-600 gap-2">
                                <MessageSquare size={28} className="opacity-30" />
                                <p className="text-sm">No messages yet. Say hello!</p>
                            </div>
                        ) : messages.map((m, i, a) => renderMsg(m, i, a))}
                        <div ref={bottomRef} />
                    </div>
                    {/* Input */}
                    <div className="p-4 border-t border-gray-800 bg-[#0a0a0a] flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <input ref={inputRef} type="text" value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder="Type a message..."
                                className="flex-1 bg-[#121212] border border-gray-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600" />
                            <button onClick={handleSend} disabled={!inputText.trim() || sending}
                                className="w-10 h-10 bg-brand-red rounded-lg flex items-center justify-center hover:bg-[#FF4D4D] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-[0_0_10px_rgba(255,51,51,0.2)]">
                                <Send size={17} className="text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Panel info */}
                {showInfo && (
                    <div className="w-60 border-l border-gray-800 bg-[#0f0f0f] flex flex-col flex-shrink-0">
                        <div className="p-4 border-b border-gray-800">
                            <h4 className="text-sm font-bold text-white">{conversation.is_group ? 'Members' : 'Profile'}</h4>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1">
                            {(conversation.participants ?? []).map(p => (
                                <div key={p.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#1a1a1a]">
                                    <Avatar name={p.nickname ?? p.name} avatarUrl={p.avatar_url} size="sm" />
                                    <div className="min-w-0">
                                        <p className="text-sm text-white truncate">{p.nickname ?? p.name}</p>
                                        {conversation.owner_id === p.id && <p className="text-[10px] text-brand-red">Owner</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {conversation.is_group && (
                            <div className="p-4 border-t border-gray-800 mt-auto">
                                <button onClick={handleLeaveGroup} className="w-full py-2.5 bg-brand-red/10 hover:bg-brand-red/20 text-brand-red rounded-lg text-xs font-bold transition-colors border border-brand-red/20">
                                    {isGroupOwner ? "Leave & Transfer/Delete Team" : "Leave Team Chat"}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Messages() {
    const { conversations, loading, activeConversationId, openConversation, addOrUpdateConversation } = useChat();
    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [showCreateTeam, setShowCreateTeam] = useState(false);
    const [showMobile, setShowMobile] = useState(false);

    const prefillMessage = location.state?.prefillMessage;

    // Clear the state so it doesn't persist on reload
    useEffect(() => {
        if (location.state?.prefillMessage) {
            const newState = { ...location.state };
            delete newState.prefillMessage;
            navigate(location.pathname, { replace: true, state: newState });
        }
    }, [location, navigate]);

    const activeConversation = conversations.find(c => c.id === activeConversationId) ?? null;

    const filtered = conversations.filter(c => {
        const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
        const matchTab = activeTab === 'All' ? true : activeTab === 'Teams' ? c.is_group : !c.is_group;
        return matchSearch && matchTab;
    });

    const handleSelect = (conv) => { openConversation(conv.id); setShowMobile(true); };
    const handleGroupCreated = (conv) => { addOrUpdateConversation(conv); openConversation(conv.id); setShowMobile(true); };

    return (
        <div className="flex h-full w-full bg-[#0a0a0a] text-white overflow-hidden rounded-xl border border-gray-800">
            {/* Sidebar */}
            <div className={`w-80 border-r border-gray-800 flex flex-col bg-[#0f0f0f] flex-shrink-0 ${showMobile ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold">Messages</h2>
                        <div className="relative">
                            <button onClick={() => setShowCreateTeam(true)}
                                className="w-8 h-8 rounded-lg bg-brand-red/10 hover:bg-brand-red/20 flex items-center justify-center text-brand-red transition-colors" title="Create Team">
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={15} />
                        <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full bg-[#1a1a1a] border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600" />
                    </div>
                    <div className="flex gap-1.5">
                        {['All', 'DMs', 'Teams'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeTab === tab ? 'bg-brand-red text-white' : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading && conversations.length === 0 ? (
                        <div className="flex items-center justify-center h-20">
                            <div className="w-5 h-5 border-2 border-brand-red/30 border-t-brand-red rounded-full animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-32 text-gray-600 gap-2 px-4 text-center">
                            <MessageSquare size={22} className="opacity-30" />
                            <p className="text-xs">{search ? 'No results' : 'No conversations yet.'}</p>
                        </div>
                    ) : filtered.map(conv => {
                        const isActive = conv.id === activeConversationId;
                        return (
                            <button key={conv.id} onClick={() => handleSelect(conv)}
                                className={`relative w-full flex items-center gap-3 px-4 py-3.5 hover:bg-[#1a1a1a] transition-colors text-left ${isActive ? 'bg-[#1a1a1a]' : ''}`}>
                                {isActive && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-red" />}
                                <Avatar name={conv.name} avatarUrl={conv.avatar_url} isGroup={conv.is_group} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-200'}`}>{conv.name}</span>
                                        <span className="text-[10px] text-gray-500 ml-2 flex-shrink-0">{formatTime(conv.last_message?.created_at)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate mt-0.5">{conv.last_message?.content || 'No messages'}</p>
                                </div>
                                {conv.unread_count > 0 && (
                                    <div className="w-5 h-5 bg-brand-red rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                        {conv.unread_count > 9 ? '9+' : conv.unread_count}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Panel derecho */}
            <div className={`flex-1 min-w-0 ${showMobile ? 'flex' : 'hidden md:flex'} flex-col`}>
                {activeConversation
                    ? <ChatPanel key={activeConversation.id} conversation={activeConversation} onBack={() => setShowMobile(false)} initialInputText={prefillMessage} />
                    : <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-3">
                        <MessageSquare size={44} className="opacity-20" />
                        <p className="text-sm">Select a conversation</p>
                        <p className="text-xs text-gray-700">or find a player to start chatting</p>
                    </div>
                }
            </div>

            {showCreateTeam && <CreateTeamModal onClose={() => setShowCreateTeam(false)} onCreated={() => navigate('/dashboard/teams')} />}
        </div>
    );
}

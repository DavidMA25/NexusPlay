import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useEcho } from '../hooks/useEcho';

const ChatContext = createContext(null);

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used inside ChatProvider');
    return ctx;
};

// React provider orchestrating websocket listeners, unread counts, and list of active conversations
export function ChatProvider({ children }) {
    const { user, token, api } = useAuth();
    const echo = useEcho(token);

    const [conversations, setConversations]               = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [loading, setLoading]                           = useState(false);

    const activeConvIdRef    = useRef(null);
    const userIdRef          = useRef(null);
    const subscribedChannels = useRef(new Set());

    const notificationHandlerRef = useRef(null);

    useEffect(() => { activeConvIdRef.current = activeConversationId; }, [activeConversationId]);
    useEffect(() => { userIdRef.current = user?.id ?? null; },          [user?.id]);

    const fetchConversations = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await api.get('/conversations');
            setConversations(res.data);
        } catch (e) {
            console.error('Error loading conversations:', e);
        } finally {
            setLoading(false);
        }
    }, [user, api]);

    useEffect(() => {
        if (user) {
            fetchConversations();
        } else {
            setConversations([]);
            subscribedChannels.current.clear();
        }
    }, [user?.id]);

    // Reacts instantly to realtime stream updates append or updating internal chat caches
    const handleIncomingMessage = useCallback((data) => {
        const isActive = activeConvIdRef.current === data.conversation_id;
        const isOwnMsg = data.sender_id === userIdRef.current;

        setConversations(prev => {
            const exists = prev.find(c => c.id === data.conversation_id);

            if (exists) {
                return prev.map(c => {
                    if (c.id !== data.conversation_id) return c;
                    return {
                        ...c,
                        last_message: {
                            content:    data.content,
                            sender_id:  data.sender_id,
                            created_at: data.created_at,
                        },
                        unread_count: isActive || isOwnMsg
                            ? 0
                            : (c.unread_count ?? 0) + 1,
                    };
                });
            }

            if (data.conversation && !isOwnMsg) {
                const isGroup = !!data.conversation.is_group;
                return [{
                    id:            data.conversation.id,
                    is_group:      isGroup,
                    group_name:    data.conversation.group_name,
                    owner_id:      data.conversation.owner_id,
                    name:          isGroup
                        ? (data.conversation.group_name || 'Group Chat')
                        : (data.sender_nickname || data.sender_name),
                    avatar_url:    isGroup ? data.conversation.avatar_url : data.sender_avatar,
                    other_user_id: isGroup ? null : data.sender_id,
                    participants:  data.conversation.participants || [],
                    last_message: {
                        content:    data.content,
                        sender_id:  data.sender_id,
                        created_at: data.created_at,
                    },
                    unread_count: 1,
                }, ...prev];
            }

            return prev;
        });
    }, []);

    useEffect(() => {
        if (!echo || !user?.id) return;

        const channelName = `user.${user.id}`;
        const channel = echo.private(channelName);

        channel
            .listen('.message.sent', handleIncomingMessage)
            .listen('.notification.received', (data) => {
                
                notificationHandlerRef.current?.(data);
            });

        return () => {
            echo.leave(channelName);
        };
    }, [echo, user?.id, handleIncomingMessage]);

    const subscribeToConversation = useCallback((conv) => {
        if (!echo) return;
        const channelName = `conversation.${conv.id}`;
        if (subscribedChannels.current.has(channelName)) return;

        echo.private(channelName)
            .listen('.message.deleted', (data) => {
                setConversations(prev =>
                    prev.map(c => {
                        if (c.id !== data.conversation_id) return c;
                        if (c.last_message?.id === data.id) {
                            return { ...c, last_message: { ...c.last_message, content: '[Message deleted]' } };
                        }
                        return c;
                    })
                );
            });

        subscribedChannels.current.add(channelName);
    }, [echo]);

    useEffect(() => {
        if (!echo) return;
        conversations.forEach(subscribeToConversation);
    }, [echo, conversations, subscribeToConversation]);

    const openConversation = useCallback((id) => {
        setActiveConversationId(id);
        activeConvIdRef.current = id;
        setConversations(prev =>
            prev.map(c => c.id === id ? { ...c, unread_count: 0 } : c)
        );
    }, []);

    const addOrUpdateConversation = useCallback((conv) => {
        setConversations(prev => {
            const exists = prev.find(c => c.id === conv.id);
            if (exists) {
                return prev.map(c =>
                    c.id === conv.id ? { ...conv, unread_count: c.unread_count ?? 0 } : c
                );
            }
            return [{ ...conv, unread_count: 0 }, ...prev];
        });
        setTimeout(() => subscribeToConversation(conv), 0);
    }, [subscribeToConversation]);

    const removeConversation = useCallback((id) => {
        setConversations(prev => prev.filter(c => c.id !== id));
        if (activeConvIdRef.current === id) {
            setActiveConversationId(null);
            activeConvIdRef.current = null;
        }
    }, []);

    const totalUnread = conversations.reduce((acc, c) => acc + (c.unread_count ?? 0), 0);

    return (
        <ChatContext.Provider value={{
            conversations,
            activeConversationId,
            loading,
            totalUnread,
            fetchConversations,
            openConversation,
            addOrUpdateConversation,
            removeConversation,
            setConversations,
            
            notificationHandlerRef,
        }}>
            {children}
        </ChatContext.Provider>
    );
}

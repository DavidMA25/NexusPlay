import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useEcho } from '../hooks/useEcho';

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications debe usarse dentro de NotificationProvider');
    return ctx;
};

export function NotificationProvider({ children }) {
    const { user, token, api } = useAuth();
    const echo = useEcho(token);

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            const res = await api.get('/notifications');
            setNotifications(res.data.data || res.data);
        } catch (e) {
            console.error('Error fetching notifications:', e);
        } finally {
            setLoading(false);
        }
    }, [user, api]);

    const fetchUnreadCount = useCallback(async () => {
        if (!user) return;
        try {
            const res = await api.get('/notifications/unread-count');
            setUnreadCount(res.data.count);
        } catch (e) {
            console.error('Error fetching unread count:', e);
        }
    }, [user, api]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
        } else {
            setNotifications([]);
            setUnreadCount(0);
        }
    }, [user?.id, fetchNotifications, fetchUnreadCount]);

    useEffect(() => {
        if (!echo || !user?.id) return;

        const channelName = `user.${user.id}`;
        const channel = echo.private(channelName);

        channel.listen('.notification.received', (data) => {
            setNotifications(prev => [data, ...prev]);
            setUnreadCount(prev => prev + 1);
            
            // Optional: Show a toast or desktop notification here
        });

        return () => {
            echo.leave(channelName);
        };
    }, [echo, user?.id]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.error('Error marking notification as read:', e);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.patch('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error('Error marking all notifications as read:', e);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            fetchNotifications,
            markAsRead,
            markAllAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

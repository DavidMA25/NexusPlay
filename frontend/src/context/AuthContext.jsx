import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const currentToken = localStorage.getItem('nexus_token');
    if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
});

export const AuthProvider = ({ children }) => {

    // =========================================================================
    // REAL AUTH STATE
    // =========================================================================
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('nexus_token'));
    const [emailVerified, setEmailVerified] = useState(false);
    const [needsVerification, setNeedsVerification] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('/user');
                const verified = response.data.email_verified ?? false;
                setUser(response.data);
                setEmailVerified(verified);
                setNeedsVerification(!verified);
            } catch (error) {
                console.error('Token might be invalid', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        const { user: userData, token: authToken, email_verified } = response.data;
        const verified = email_verified ?? false;

        localStorage.setItem('nexus_token', authToken);
        setToken(authToken);
        setUser(userData);
        setEmailVerified(verified);
        setNeedsVerification(!verified);
        return userData;
    };

    const register = async (name, email, password, role = 'player', teamName = null, region = null, website = null, description = null) => {
        const payload = { name, email, password, role };
        if (role === 'team') {
            payload.team_name = teamName;
            payload.region    = region;
            payload.website   = website;
            payload.description = description;
        }

        const response = await api.post('/register', payload);
        const { user: userData, token: authToken } = response.data;

        localStorage.setItem('nexus_token', authToken);
        setToken(authToken);
        setUser(userData);
        setEmailVerified(false);
        setNeedsVerification(true);
        return userData;
    };

    const logout = async () => {
        if (token) {
            try { await api.post('/logout'); } catch (e) { console.error(e); }
        }
        localStorage.removeItem('nexus_token');
        setToken(null);
        setUser(null);
        setEmailVerified(false);
        setNeedsVerification(false);
    };

    const updateUser = (newUserData) => setUser(newUserData);

    const resendVerificationEmail = async () => {
        await api.post('/email/resend');
    };

    const verifyEmail = async (verifyUrl) => {
        const response = await api.get(verifyUrl.replace(
            (import.meta.env.VITE_API_URL || 'http://localhost:8000/api'), ''
        ));
        setEmailVerified(true);
        setNeedsVerification(false);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{
            user, token, emailVerified, needsVerification,
            login, register, logout, loading,
            api, updateUser, resendVerificationEmail, verifyEmail
        }}>
            {children}
        </AuthContext.Provider>
    );
};
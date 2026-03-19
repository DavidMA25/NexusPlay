import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // ajusta el puerto si tu backend es distinto
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// We add an interceptor to inject the token into every request using localStorage directly
api.interceptors.request.use((config) => {
    const currentToken = localStorage.getItem('nexus_token');
    if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('nexus_token') || null);
    const [loading, setLoading] = useState(true);

    // Check user data on load or token change
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error("Token might be invalid", error);
                logout(); // Si falla, tiramos el token
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        const { user: userData, token: authToken } = response.data;

        localStorage.setItem('nexus_token', authToken);
        setToken(authToken);
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password, role = 'player', teamName = null, region = null, website = null, description = null) => {
        const payload = { name, email, password, role };
        if (role === 'team') {
            payload.team_name = teamName;
            payload.region = region;
            payload.website = website;
            payload.description = description;
        }
        
        const response = await api.post('/register', payload);
        const { user: userData, token: authToken } = response.data;

        localStorage.setItem('nexus_token', authToken);
        setToken(authToken);
        setUser(userData);
        return userData;
    };

    const logout = async () => {
        if (token) {
            try {
                await api.post('/logout');
            } catch (e) {
                console.error(e);
            }
        }
        localStorage.removeItem('nexus_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, api }}>
            {children}
        </AuthContext.Provider>
    );
};

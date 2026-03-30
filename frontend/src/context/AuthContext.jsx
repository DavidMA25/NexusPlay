import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
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
    // BYPASS PARA FRONTEND: Forzamos usuario y token para entrar directo al Dashboard
    const [user, setUser] = useState({ id: 1, name: 'Shadow', email: 'shadow@nexusplay.com', role: 'player' });
    const [token, setToken] = useState('bypass-token-frontend');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        /*
        BYPASS: Comentamos la llamada real al backend temporalmente.
        Así evitamos que dé error de red y te borre el usuario falso.
        
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
                logout(); 
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        */
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

    const updateUser = (newUserData) => {
        setUser(newUserData);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, api, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
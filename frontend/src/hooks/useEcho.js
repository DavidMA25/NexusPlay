

import { useEffect, useRef } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

let echoInstance = null;
let echoToken    = null;  

// Singleton holder function that manages valid Echo websocket instances per specific token
function buildEcho(token) {
    
    const apiBase = (import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api')
        .replace(/\/api\/?$/, '');

    window.Pusher = Pusher;

    return new Echo({
        broadcaster:  'reverb',
        key:          import.meta.env.VITE_REVERB_APP_KEY ?? '',
        wsHost:       import.meta.env.VITE_REVERB_HOST    ?? 'localhost',
        wsPort:       Number(import.meta.env.VITE_REVERB_PORT   ?? 8080),
        wssPort:      Number(import.meta.env.VITE_REVERB_PORT   ?? 8080),
        forceTLS:    (import.meta.env.VITE_REVERB_SCHEME  ?? 'http') === 'https',
        enabledTransports: ['ws', 'wss'],
        
        authEndpoint: `${apiBase}/api/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept:        'application/json',
            },
        },
    });
}

function getEcho(token) {
    
    if (echoInstance && echoToken !== token) {
        echoInstance.disconnect();
        echoInstance = null;
        echoToken    = null;
    }

    if (!echoInstance) {
        echoInstance = buildEcho(token);
        echoToken    = token;
    }

    return echoInstance;
}

export function disconnectEcho() {
    if (echoInstance) {
        echoInstance.disconnect();
        echoInstance = null;
        echoToken    = null;
    }
}

// React hook providing consistent global access to realtime websocket subscriptions
export function useEcho(token) {
    const ref = useRef(null);

    useEffect(() => {
        if (!token) {
            disconnectEcho();
            ref.current = null;
            return;
        }
        ref.current = getEcho(token);
    }, [token]);

    return token ? getEcho(token) : null;
}

import { useState } from 'react';
import { Mail, RefreshCw, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmailNotice() {
    const { user, resendVerificationEmail, logout } = useAuth();
    const [status, setStatus] = useState('idle'); 
    const navigate = useNavigate();

    const handleResend = async () => {
        setStatus('sending');
        try {
            await resendVerificationEmail();
            setStatus('sent');
        } catch {
            setStatus('error');
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.08) 0%, rgba(10, 10, 10, 0) 60%)`
            }}>
            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-10 w-full max-w-md shadow-2xl relative overflow-hidden text-center">

                {}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />

                {}
                <div className="w-16 h-16 bg-brand-red/10 border border-brand-red/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail size={30} className="text-brand-red" />
                </div>

                <h2 className="text-white text-2xl font-bold mb-2">Verifica tu email</h2>
                <p className="text-gray-400 text-sm mb-1">
                    Hemos enviado un enlace de verificación a:
                </p>
                <p className="text-white font-semibold text-sm mb-6 truncate">
                    {user?.email}
                </p>
                <p className="text-gray-500 text-xs mb-8 leading-relaxed">
                    Abre tu bandeja de entrada y haz clic en el enlace para activar tu cuenta.
                    Si no lo ves, revisa la carpeta de spam.
                </p>

                {status === 'sent' && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 mb-6">
                        ✓ Email reenviado correctamente.
                    </div>
                )}
                {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">
                        No se pudo reenviar el email. Inténtalo de nuevo.
                    </div>
                )}

                <button
                    onClick={handleResend}
                    disabled={status === 'sending' || status === 'sent'}
                    className="w-full flex items-center justify-center gap-2 bg-brand-red hover:bg-[#FF4D4D] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/20 transition-all mb-4"
                >
                    <RefreshCw size={16} className={status === 'sending' ? 'animate-spin' : ''} />
                    {status === 'sending' ? 'Enviando...' : 'Reenviar email de verificación'}
                </button>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm py-2 transition-colors"
                >
                    <LogOut size={14} />
                    Usar otra cuenta
                </button>
            </div>
        </div>
    );
}

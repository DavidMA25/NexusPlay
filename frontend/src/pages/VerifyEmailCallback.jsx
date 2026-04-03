import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function VerifyEmailCallback() {
    const [searchParams] = useSearchParams();
    const { verifyEmail, token } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying | success | error | no_token

    useEffect(() => {
        const verifyUrl = searchParams.get('verify_url');

        if (!verifyUrl) {
            setStatus('error');
            return;
        }

        if (!token) {
            // El usuario llegó al enlace sin estar logueado: guarda la URL y mándalo al login
            sessionStorage.setItem('pending_verify_url', verifyUrl);
            navigate('/login?redirect=verify');
            return;
        }

        verifyEmail(verifyUrl)
            .then(() => setStatus('success'))
            .catch(() => setStatus('error'));
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center px-4"
            style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.08) 0%, rgba(10, 10, 10, 0) 60%)`
            }}>
            <div className="bg-[#121212] border border-gray-800 rounded-2xl p-10 w-full max-w-md shadow-2xl relative overflow-hidden text-center">

                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50" />

                {status === 'verifying' && (
                    <>
                        <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h2 className="text-white text-xl font-bold">Verificando tu email...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={30} className="text-green-400" />
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-2">¡Email verificado!</h2>
                        <p className="text-gray-400 text-sm mb-8">
                            Tu cuenta está activa. Ya puedes acceder al dashboard.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full bg-brand-red hover:bg-[#FF4D4D] text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/20 transition-all"
                        >
                            Ir al Dashboard
                        </button>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle size={30} className="text-red-400" />
                        </div>
                        <h2 className="text-white text-2xl font-bold mb-2">Enlace inválido</h2>
                        <p className="text-gray-400 text-sm mb-8">
                            El enlace ha expirado o ya fue usado. Solicita uno nuevo desde tu cuenta.
                        </p>
                        <button
                            onClick={() => navigate('/verify-email')}
                            className="w-full bg-brand-red hover:bg-[#FF4D4D] text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/20 transition-all"
                        >
                            Reenviar verificación
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

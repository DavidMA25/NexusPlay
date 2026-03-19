import { Eye, EyeOff, Chrome } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            {/* Contenedor principal de la tarjeta de Login */}
            <div
                className="bg-[#121212] border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">

                {/* Efecto de brillo superior */}
                <div
                    className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50"></div>

                {/* Logo y Título */}
                <div className="text-center mb-8">
                    <div
                        className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-brand-red/20">
                        N
                    </div>
                    <h2 className="text-white text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm">Sign in to your NexusPlay account</p>
                </div>

                {/* Formulario */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}
                <form className="space-y-6" onSubmit={handleSubmit}>

                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all placeholder-gray-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all placeholder-gray-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded bg-[#1a1a1a] border-gray-700 text-brand-red focus:ring-0 w-4 h-4"
                            />
                            <span className="text-gray-400 select-none">Remember me</span>
                        </label>
                        <a
                            href="#"
                            className="text-brand-red hover:text-[#FF4D4D] font-medium transition-colors"
                        >
                            Forgot password?
                        </a>
                    </div>

                    {/* Botón de Login */}
                    <button
                        className="w-full bg-brand-red hover:bg-[#FF4D4D] text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/20 transition-all hover:shadow-brand-red/40"
                    >
                        Login
                    </button>
                </form>

                {/* Footer del Login */}
                <p className="text-center text-gray-400 text-sm mt-8">
                    Don't have an account? <a href="#" className="text-brand-red hover:text-[#FF4D4D] font-medium transition-colors">Register</a>
                </p>

            </div>
        </div>
    );
}
import { Eye, EyeOff, Chrome, User, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('player'); 

  return (
    /* CAMBIO AQUÍ: min-h-[calc(100vh-80px)] descuenta el Navbar y py-12 iguala los márgenes */
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      
      {/* Contenedor principal */}
      <div 
        className="bg-[#121212] border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        
        {/* Efecto de brillo superior */}
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50"
        ></div>

        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div 
            className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-brand-red/20"
          >
            N
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">Join NexusPlay</h2>
          <p className="text-gray-400 text-sm">Create your account and start competing</p>
        </div>

        {/* Formulario */}
        <form className="space-y-5">

          {/* Selector de Rol (Player / Team) */}
          <div className="flex gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('player')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                role === 'player' 
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                  : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:text-white'
              }`}
            >
              <User size={16} />
              I'm a Player
            </button>
            <button
              type="button"
              onClick={() => setRole('team')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                role === 'team' 
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20' 
                  : 'bg-[#1a1a1a] text-gray-400 border border-gray-700 hover:text-white'
              }`}
            >
              <Trophy size={16} />
              I'm a Team
            </button>
          </div>
          
          {/* Username Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input 
              type="text" 
              placeholder="Choose a username"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all placeholder-gray-500"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email
            </label>
            <input 
              type="email" 
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
                placeholder="........"
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input 
              type="password" 
              placeholder="........"
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all placeholder-gray-500"
            />
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-start gap-2 text-sm mt-4">
            <input 
              type="checkbox" 
              className="rounded bg-[#1a1a1a] border-gray-700 text-brand-red focus:ring-0 w-4 h-4 mt-0.5" 
            />
            <span className="text-gray-400">
              I agree to the <a href="#" className="text-brand-red hover:underline">Terms of Service</a> and <a href="#" className="text-brand-red hover:underline">Privacy Policy</a>
            </span>
          </div>

          {/* Botón principal */}
          <button 
            className="w-full bg-brand-red hover:bg-[#FF4D4D] text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/20 transition-all hover:shadow-brand-red/40 mt-4"
          >
            Create Account
          </button>
        </form>

        {/* Separador "or" */}
        <div className="flex items-center gap-4 my-6">
          <div className="h-px bg-gray-800 flex-1"></div>
          <span className="text-gray-500 text-xs uppercase">or</span>
          <div className="h-px bg-gray-800 flex-1"></div>
        </div>

        {/* Botón de Google */}
        <button 
          className="w-full bg-[#1a1a1a] hover:bg-[#252525] border border-gray-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-3 transition-colors"
        >
          <Chrome size={20} className="text-white" />
          Continue with Google
        </button>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account? <Link to="/login" className="text-brand-red hover:text-[#FF4D4D] font-medium transition-colors">Login</Link>
        </p>

      </div>
    </div>
  );
}
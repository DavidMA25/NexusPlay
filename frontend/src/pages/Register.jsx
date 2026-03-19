import { Eye, EyeOff, Chrome, User, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('player'); 
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [teamName, setTeamName] = useState('');
  const [region, setRegion] = useState('');
  const [website, setWebsite] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
      }
      if (role === 'team' && (!teamName || !region)) {
          setError('El nombre del equipo y la región son obligatorios');
          return;
      }
      setLoading(true);
      try {
          await register(name, email, password, role, teamName, region, website, description);
          navigate('/dashboard');
      } catch (err) {
          setError(err.response?.data?.message || 'Error al crear la cuenta. Intenta nuevamente.');
      } finally {
          setLoading(false);
      }
  }; 

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
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                {error}
            </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>

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
          
          {role === 'team' && (
            <div className="space-y-4 p-4 border border-brand-red/30 bg-brand-red/5 rounded-lg mb-6">
              <h3 className="text-brand-red text-sm font-semibold mb-2">Team Details</h3>
              
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Team Name *</label>
                <input 
                  type="text" 
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required={role === 'team'}
                  placeholder="Your Team Name"
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Region *</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required={role === 'team'}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-gray-400 text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all"
                >
                  <option value="" disabled>Select your region</option>
                  <option value="EU" className="text-white">Europe (EU)</option>
                  <option value="NA" className="text-white">North America (NA)</option>
                  <option value="SA" className="text-white">South America (SA)</option>
                  <option value="ASIA" className="text-white">Asia</option>
                  <option value="OCE" className="text-white">Oceania (OCE)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Website (Optional)</label>
                <input 
                  type="url" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://your-team.com"
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Description (Optional)</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  placeholder="Tell us about your team..."
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red transition-all placeholder-gray-500 resize-none"
                ></textarea>
              </div>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Username
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
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
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-[#FF4D4D] text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/20 transition-all hover:shadow-brand-red/40 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account? <Link to="/login" className="text-brand-red hover:text-[#FF4D4D] font-medium transition-colors">Login</Link>
        </p>

      </div>
    </div>
  );
}
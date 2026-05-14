import { Eye, EyeOff, Chrome, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Registration page component for creating new player accounts
export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validates the form data and attempts to register the user
  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      if (password !== confirmPassword) {
          setError('Passwords do not match');
          return;
      }
      setLoading(true);
      try {
          await register(name, email, password);
          navigate('/verify-email');
      } catch (err) {
          setError(err.response?.data?.message || 'Error creating account. Please try again.');
      } finally {
          setLoading(false);
      }
  }; 

  return (
    
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      
      {/* Form Container */}
      <div 
        className="bg-[#121212] border border-gray-800 rounded-2xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
      >
        
        {/* Decorative top accent */}
        <div 
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-50"
        ></div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <div 
            className="w-12 h-12 bg-brand-red rounded-lg flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-brand-red/20"
          >
            N
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">Join NexusPlay</h2>
          <p className="text-gray-400 text-sm">Create your account and start competing</p>
        </div>

        {/* Global error notice */}
        {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center">
                {error}
            </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>

          {/* User Info */}
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

          {/* Email */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red hover:bg-[#FF4D4D] text-white font-bold py-3 rounded-lg shadow-lg shadow-brand-red/20 transition-all hover:shadow-brand-red/40 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {}
        <p className="text-center text-gray-400 text-sm mt-8">
          Already have an account? <Link to="/login" className="text-brand-red hover:text-[#FF4D4D] font-medium transition-colors">Login</Link>
        </p>

      </div>
    </div>
  );
}
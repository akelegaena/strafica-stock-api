import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sun, Moon } from 'lucide-react';
import api from './api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
        const res = await api.post('/login', {
        email,
        password
        });

        localStorage.setItem('token', res.data.token);

        navigate('/dashboard');
    } catch (err) {
        setError(err.response?.data?.message || 'Identifiants incorrects');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} relative overflow-hidden`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-4 right-4 z-50 p-3 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100 border border-gray-200'}`}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Background Pattern */}
      <div className={`absolute inset-0 opacity-5 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Floating Elements */}
      <div className={`absolute top-20 left-20 w-32 h-32 rounded-full blur-xl animate-pulse ${darkMode ? 'bg-blue-500/20' : 'bg-blue-200/30'}`}></div>
      <div className={`absolute bottom-20 right-20 w-40 h-40 rounded-full blur-xl animate-pulse ${darkMode ? 'bg-indigo-500/20' : 'bg-indigo-200/30'}`}></div>
      <div className={`absolute top-1/2 left-1/4 w-24 h-24 rounded-full blur-xl animate-pulse ${darkMode ? 'bg-cyan-500/20' : 'bg-cyan-200/30'}`}></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${darkMode ? 'bg-white/10' : 'bg-blue-100'} backdrop-blur-sm`}>
            <div className="text-center leading-tight">
              <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-blue-900'}`}>STR</div>
              <div className={`text-[8px] -mt-1 ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>AFRICA</div>
            </div>
          </div>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Bienvenue</h1>
          <p className={darkMode ? 'text-blue-200' : 'text-gray-600'}>Connectez-vous à votre compte</p>
        </div>

        {/* Login Form */}
        <form onSubmit={submit} className={`backdrop-blur-lg rounded-2xl p-8 shadow-2xl border transition-colors ${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-gray-200'}`}>
          <div className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-gray-400'}`} />
                <input
                  type="email"
                  className={`w-full pl-12 pr-4 py-3 rounded-lg transition-all duration-200 border focus:outline-none focus:ring-2 ${darkMode ? 'bg-white/5 border-white/20 text-white placeholder-blue-300 focus:ring-blue-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'}`}
                  placeholder="votre@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-blue-200' : 'text-gray-700'}`}>Mot de passe</label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-blue-300' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-12 pr-12 py-3 rounded-lg transition-all duration-200 border focus:outline-none focus:ring-2 ${darkMode ? 'bg-white/5 border-white/20 text-white placeholder-blue-300 focus:ring-blue-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'}`}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${darkMode ? 'text-blue-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={`border rounded-lg p-3 ${darkMode ? 'bg-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                <p className={`text-sm text-center ${darkMode ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Se connecter
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
            Système de gestion de stock STR Africa
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Package, TrendingUp, Users, Settings, LogOut, User, ChevronDown, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from './api';

export default function Sidebar({ darkMode, setDarkMode, sidebarCollapsed, setSidebarCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: Package, label: 'Dashboard', path: '/dashboard' },
    { icon: Package, label: 'Articles', path: '/articles' },
    { icon: TrendingUp, label: 'Mouvements', path: '/mouvements' },
    { icon: Users, label: 'Fournisseurs', path: '/fournisseurs' },
    { icon: Settings, label: 'Paramètres', path: '/parametres' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Fixed Sidebar */}
      <aside className={`fixed left-0 top-0 h-screen border-r p-4 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      } ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
        {/* Logo / Toggle Button */}
        {!sidebarCollapsed ? (
          <div className={`px-4 py-4 rounded-lg font-bold text-lg flex items-center justify-between gap-2 mb-8 ${
            darkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-blue-900'
          }`}>
            <div className="flex items-center gap-2">
              <div className="text-center">
                <div className="text-xl">STR</div>
                <div className="text-[8px] -mt-1">AFRICA</div>
              </div>
              <span className="text-sm">STOCK</span>
            </div>
            <button
              onClick={() => setSidebarCollapsed(true)}
              className={`p-1 rounded transition-colors ${
                darkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setSidebarCollapsed(false)}
              className={`p-2 rounded transition-colors ${
                darkMode ? 'bg-blue-900 hover:bg-blue-800 text-white' : 'bg-blue-100 hover:bg-blue-200 text-blue-900'
              }`}
              title="Déplie le sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className={`${sidebarCollapsed ? 'space-y-3' : 'space-y-2'} mb-8`}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={sidebarCollapsed ? item.label : ''}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors text-left ${
                  active
                    ? darkMode
                      ? 'bg-blue-900 text-white'
                      : 'bg-blue-100 text-blue-900'
                    : darkMode
                    ? 'text-white hover:bg-gray-800'
                    : 'text-blue-900 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{
          borderColor: darkMode ? '#1f2937' : '#d1d5db'
        }}>
          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={sidebarCollapsed ? (darkMode ? 'Mode clair' : 'Mode sombre') : ''}
            className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-lg transition-colors mb-3 ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!sidebarCollapsed && <span>{darkMode ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              title={sidebarCollapsed ? 'Admin' : ''}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-2 px-4'} py-3 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                <User className="w-5 h-5" />
              </div>
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm">Admin</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {userMenuOpen && !sidebarCollapsed && (
              <div className={`absolute bottom-full left-0 right-0 mb-2 rounded-lg shadow-xl overflow-hidden z-50 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-red-400 text-left transition-colors text-sm ${
                    darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}

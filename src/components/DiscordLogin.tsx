import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Mail, Shield, Loader, AlertCircle, CheckCircle, Moon, Sun, Palette } from 'lucide-react';
import { authManager, type AuthState } from '../utils/auth';

interface DiscordLoginProps {
  theme?: string;
  onThemeChange?: (theme: string) => void;
  onLoginSuccess?: () => void;
}

const DiscordLogin: React.FC<DiscordLoginProps> = ({ 
  theme = 'dark', 
  onThemeChange,
  onLoginSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState());
  const [serverJoinStatus, setServerJoinStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  const CLIENT_ID = '1090917458346524734';
  const REDIRECT_URI = window.location.origin;
  const DISCORD_OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds.join`;
  const GUILD_ID = '1388084142075547680';

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      setError('Login was cancelled or failed');
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (code && !authState.isAuthenticated) {
      handleOAuthCallback(code);
    }

    return unsubscribe;
  }, []);

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/90 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          discordButton: 'bg-[#5865F2] hover:bg-[#4752C4]',
          input: 'bg-white/80 border-gray-300 text-gray-900'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80',
          discordButton: 'bg-[#5865F2]/80 hover:bg-[#4752C4]/80 backdrop-blur-sm',
          input: 'bg-white/5 border-white/10 text-white'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          discordButton: 'bg-[#5865F2] hover:bg-[#4752C4]',
          input: 'bg-white/10 border-white/20 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const handleOAuthCallback = async (code: string) => {
    setIsLoading(true);
    setError('');
    setServerJoinStatus('pending');

    try {
      // Send code to backend for processing
      const response = await fetch('/api/discord-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, guildId: GUILD_ID })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Authentication failed');
      }

      const { user, accessToken, joinedServer } = await response.json();
      
      // Update server join status
      setServerJoinStatus(joinedServer ? 'success' : 'failed');
      
      // Store auth data
      authManager.setAuth(user, accessToken);

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

      if (onLoginSuccess) onLoginSuccess();

    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Login failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    setError('');
    window.location.href = DISCORD_OAUTH_URL;
  };

  const handleLogout = () => {
    authManager.clearAuth();
    setError('');
    setServerJoinStatus('pending');
  };

  const ThemeToggle = () => (
    <div className="absolute top-6 right-6 flex items-center space-x-2">
      <div className={`${themeStyles.card} rounded-xl p-2 flex items-center space-x-1 border`}>
        <button
          onClick={() => onThemeChange?.('dark')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Moon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onThemeChange?.('light')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'light' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => onThemeChange?.('glass')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'glass' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  if (authState.isAuthenticated && authState.user) {
    return (
      <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4 relative`}>
        <ThemeToggle />
        
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-8 text-center border shadow-2xl relative z-10`}>
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <img 
              src={authManager.getAvatarUrl()} 
              alt="Avatar" 
              className="w-full h-full rounded-full border-4 border-purple-500 shadow-lg animate-pulse"
            />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          <h2 className={`text-2xl font-bold ${themeStyles.text} mb-2`}>
            Welcome back!
          </h2>
          
          <p className={`${themeStyles.textSecondary} mb-6`}>
            {authState.user.global_name || authState.user.username}
          </p>

          <div className={`${themeStyles.card} p-4 rounded-xl mb-6 border`}>
            <div className="flex items-center justify-center space-x-2 mb-2">
              <MessageCircle className="w-5 h-5 text-[#5865F2]" />
              <span className={`font-semibold ${themeStyles.text}`}>
                {authManager.getDiscordUsername()}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className={`text-sm ${themeStyles.textMuted}`}>
                {authState.user.email}
              </span>
            </div>
          </div>

          {/* Server join status */}
          {serverJoinStatus === 'success' ? (
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3 mb-4 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-green-300 text-sm">Joined Discord server!</span>
            </div>
          ) : serverJoinStatus === 'failed' ? (
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3 mb-4">
              <div className="flex items-center justify-center mb-1">
                <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-yellow-300 text-sm">Couldn't auto-join server</span>
              </div>
              <a 
                href="https://discord.gg/Qy6tuNJmwJ" 
                target="_blank"
                className="text-blue-300 hover:text-blue-100 text-sm underline"
              >
                Join manually: discord.gg/Qy6tuNJmwJ
              </a>
            </div>
          ) : null}

          <button
            onClick={handleLogout}
            className={`w-full ${themeStyles.button} text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg mb-4`}
          >
            Logout
          </button>

          <p className={`text-xs ${themeStyles.textMuted}`}>
            You can now place orders and access all features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4 relative`}>
      <ThemeToggle />
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.1%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-8 text-center border shadow-2xl relative z-10`}>
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
            <img 
              src="/05b5bc0e84997d92e62826cfce30b63a.webp" 
              alt="JXFRCloud Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${themeStyles.text}`}>JXFRCloud™</h1>
            <p className={`text-sm ${themeStyles.textMuted}`}>Premium Hosting Solutions</p>
          </div>
        </div>

        <h2 className={`text-3xl font-bold ${themeStyles.text} mb-4`}>
          Welcome Back
        </h2>
        
        <p className={`${themeStyles.textSecondary} mb-8`}>
          Sign in with Discord to access your hosting dashboard and place orders
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full ${themeStyles.discordButton} disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3 mb-6`}
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              <span>Login with Discord</span>
            </>
          )}
        </button>

        <div className={`${themeStyles.card} p-4 rounded-xl border mb-4`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <MessageCircle className="w-4 h-4 text-[#5865F2]" />
            <span className={`font-semibold ${themeStyles.text} text-sm`}>Auto-Join Discord Server</span>
          </div>
          <p className={`text-xs ${themeStyles.textMuted} mb-3`}>
            You'll automatically join our server when you login
          </p>
          <a
            href="https://discord.gg/Qy6tuNJmwJ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5865F2] hover:text-[#4752C4] text-sm font-medium transition-colors"
          >
            Manual Join: discord.gg/Qy6tuNJmwJ
          </a>
        </div>

        <div className={`${themeStyles.card} p-4 rounded-xl border`}>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-green-400" />
            <span className={`font-semibold ${themeStyles.text} text-sm`}>Secure OAuth2 Login</span>
          </div>
          <p className={`text-xs ${themeStyles.textMuted}`}>
            We only access your Discord username, avatar, and email. No passwords stored.
          </p>
        </div>

        <p className={`text-xs ${themeStyles.textMuted} mt-6`}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default DiscordLogin;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Globe, 
  Server, 
  Shield, 
  Zap, 
  Users, 
  Clock, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Search, 
  Gamepad2, 
  Cpu, 
  HardDrive, 
  MapPin, 
  Plus, 
  Minus,
  Moon,
  Sun,
  Palette,
  Award,
  TrendingUp,
  Heart,
  Sparkles,
  MessageCircle,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import PaymentForm from './components/PaymentForm';
import DomainOrderForm from './components/DomainOrderForm';
import DomainTLDList from './components/DomainTLDList';
import MinecraftHero from './components/MinecraftHero';
import PlanTabs from './components/PlanTabs';
import DomainPage from './components/DomainPage';
import HostingPage from './components/HostingPage';
import VPSPage from './components/VPSPage';
import VPSOrderForm from './components/VPSOrderForm';
import DiscordLogin from './components/DiscordLogin';
import UserProfile from './components/UserProfile';
import AdminRouter from './components/admin/AdminRouter';
import { authManager, type AuthState } from './utils/auth';
import { superDatabase } from './utils/database';

// Get special offers for display
const getSpecialOffers = () => {
  return superDatabase.getActiveSpecialOffers();
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminRouter />} />
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

function MainApp() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState({ units: 0, backups: 0 });
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState());
  const [specialOffers, setSpecialOffers] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const unsubscribe = authManager.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const domainExtensions = [
    { tld: '.com', price: '₹999' },
    { tld: '.in', price: '₹599' },
    { tld: '.org', price: '₹899' },
    { tld: '.net', price: '₹1099' },
    { tld: '.co', price: '₹1299' },
    { tld: '.io', price: '₹2999' },
    { tld: '.dev', price: '₹1999' },
    { tld: '.app', price: '₹1599' }
  ];

  const handlePlanSelect = (plan) => {
    // Check if user is authenticated before allowing checkout
    if (!authState.isAuthenticated) {
      setCurrentView('login');
      return;
    }
    
    setSelectedPlan(plan);
    setSelectedAddons({ units: 0, backups: 0 });
    if (currentView === 'hosting') {
      setCurrentView('checkout');
    } else if (currentView === 'vps') {
      setCurrentView('vps-checkout');
    }
  };

  const handleDomainSearch = () => {
    if (!searchQuery.trim()) return;
    
    const results = domainExtensions.map(ext => ({
      domain: searchQuery.toLowerCase().replace(/\s+/g, ''),
      tld: ext.tld,
      price: ext.price,
      available: Math.random() > 0.3
    }));
    
    setSearchResults(results);
  };

  const handleDomainSelect = (domain) => {
    // Check if user is authenticated before allowing checkout
    if (!authState.isAuthenticated) {
      setCurrentView('login');
      return;
    }
    
    setSelectedDomain(domain);
    setCurrentView('domain-checkout');
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/80 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          glowButton: 'shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          pinkGlow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
          pinkButton: 'bg-gradient-to-r from-pink-500/80 to-rose-500/80 hover:from-pink-600/80 hover:to-rose-600/80',
          pinkGlow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40',
          pinkButton: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600',
          pinkGlow: 'shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const ThemeToggle = () => (
    <div className="flex items-center space-x-2">
      <div className={`${themeStyles.card} rounded-xl p-2 flex items-center space-x-1`}>
        <button
          onClick={() => setTheme('dark')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'dark' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Moon className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => setTheme('light')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'light' ? 'bg-blue-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Sun className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => setTheme('glass')}
          className={`p-2 rounded-lg transition-all duration-300 ${theme === 'glass' ? 'bg-pink-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          <Palette className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );

  // Show login page if not authenticated and trying to access protected routes
  if (currentView === 'login' || (!authState.isAuthenticated && ['checkout', 'domain-checkout', 'vps-checkout'].includes(currentView))) {
    return <DiscordLogin 
      theme={theme} 
      onThemeChange={setTheme}
      onLoginSuccess={() => setCurrentView('home')}
    />;
  }

  if (currentView === 'profile') {
    return <UserProfile 
      theme={theme}
      onBack={() => setCurrentView('home')}
      onLogout={() => setCurrentView('home')}
    />;
  }



  if (currentView === 'checkout') {
    return <PaymentForm 
      selectedPlan={selectedPlan} 
      selectedAddons={selectedAddons}
      onBack={() => setCurrentView('hosting')} 
      theme={theme}
    />;
  }

  if (currentView === 'vps-checkout') {
    return <VPSOrderForm 
      selectedPlan={selectedPlan} 
      onBack={() => setCurrentView('vps')} 
      theme={theme}
    />;
  }

  if (currentView === 'domain-checkout') {
    return <DomainOrderForm 
      selectedDomain={selectedDomain} 
      onBack={() => setCurrentView('domains')} 
      theme={theme}
    />;
  }

  if (currentView === 'domains') {
    return <DomainPage 
      theme={theme}
      onBack={() => setCurrentView('home')}
      onDomainSelect={handleDomainSelect}
    />;
  }

  if (currentView === 'hosting') {
    return <HostingPage 
      theme={theme}
      onBack={() => setCurrentView('home')}
      onPlanSelect={handlePlanSelect}
    />;
  }

  if (currentView === 'vps') {
    return <VPSPage 
      theme={theme}
      onBack={() => setCurrentView('home')}
      onPlanSelect={handlePlanSelect}
    />;
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg} font-['Inter',sans-serif]`}>
      {/* Header */}
      <header className={`${isScrolled ? themeStyles.card : 'bg-transparent'} border-b border-white/10 sticky top-0 z-50 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer" onClick={() => setCurrentView('home')}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/05b5bc0e84997d92e62826cfce30b63a.webp" 
                  alt="JXFRCloud Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className={`text-lg sm:text-2xl font-bold ${themeStyles.text}`}>JXFRCloud™</h1>
                <p className={`text-xs sm:text-sm ${themeStyles.textMuted} hidden sm:block`}>Premium Hosting Solutions</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => setCurrentView('home')}
                className={`${currentView === 'home' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}
              >
                Home
              </button>
              <button 
                onClick={() => setCurrentView('domains')}
                className={`${currentView === 'domains' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}
              >
                Domains
              </button>
              <button 
                onClick={() => setCurrentView('hosting')}
                className={`${currentView === 'hosting' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}
              >
                Hosting
              </button>
              <button 
                onClick={() => setCurrentView('vps')}
                className={`${currentView === 'vps' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium`}
              >
                VPS
              </button>
              <a 
                href="https://discord.gg/Qy6tuNJmwJ" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium flex items-center`}
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Discord
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
              
              {/* Auth Section */}
              {authState.isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentView('profile')}
                    className="flex items-center space-x-2 hover:text-purple-400 transition-colors"
                  >
                    <img 
                      src={authManager.getAvatarUrl()} 
                      alt="Avatar" 
                      className="w-8 h-8 rounded-full border-2 border-purple-500"
                    />
                    <span className={`${themeStyles.textSecondary} font-medium`}>
                      {authManager.getFirstName() || authState.user?.username}
                    </span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentView('login')}
                  className={`${themeStyles.button} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
              
              <ThemeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg ${themeStyles.card} border`}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className={`lg:hidden ${themeStyles.card} border rounded-xl p-4 mb-4`}>
              <nav className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    setCurrentView('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${currentView === 'home' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium text-left`}
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('domains');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${currentView === 'domains' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium text-left`}
                >
                  Domains
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('hosting');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${currentView === 'hosting' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium text-left`}
                >
                  Hosting
                </button>
                <button 
                  onClick={() => {
                    setCurrentView('vps');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`${currentView === 'vps' ? 'text-purple-400' : themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium text-left`}
                >
                  VPS
                </button>
                <a 
                  href="https://discord.gg/Qy6tuNJmwJ" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium flex items-center`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Discord
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
                
                {/* Mobile Auth Section */}
                {authState.isAuthenticated ? (
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 hover:text-purple-400 transition-colors text-left"
                  >
                    <img 
                      src={authManager.getAvatarUrl()} 
                      alt="Avatar" 
                      className="w-6 h-6 rounded-full border-2 border-purple-500"
                    />
                    <span className={`${themeStyles.textSecondary} font-medium`}>
                      Profile
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrentView('login');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`${themeStyles.textSecondary} hover:text-purple-400 transition-colors font-medium flex items-center text-left`}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Login with Discord
                  </button>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            <span className={`text-xs sm:text-sm font-semibold ${themeStyles.text}`}>✨ Premium Services for Indian Gamers</span>
          </div>

          <h1 className={`text-3xl sm:text-5xl md:text-7xl font-bold ${themeStyles.text} mb-4 sm:mb-6 leading-tight`}>
            Power Your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Digital Dreams
            </span>
          </h1>
          
          <p className={`text-base sm:text-xl md:text-2xl ${themeStyles.textSecondary} mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4`}>
            Premium domain registration, blazing-fast Minecraft hosting, and enterprise VPS solutions designed specifically for Indian users.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
            <button 
              onClick={() => setCurrentView('domains')}
              className={`w-full sm:w-auto ${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}
            >
              <Globe className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
              Register Domain
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setCurrentView('hosting')}
              className={`w-full sm:w-auto ${themeStyles.button} ${themeStyles.glowButton} text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}
            >
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
              Start Hosting
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          {/* Login Prompt for Non-Authenticated Users */}
          {!authState.isAuthenticated && (
            <div className={`mt-8 ${themeStyles.card} p-4 rounded-xl border max-w-md mx-auto`}>
              <p className={`text-center ${themeStyles.textSecondary} text-sm mb-3`}>
                🔐 Login with Discord to place orders and access all features
              </p>
              <button
                onClick={() => setCurrentView('login')}
                className={`w-full ${themeStyles.button} text-white py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 text-sm`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Login with Discord</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Service Cards */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Domain Registration Card */}
            <div className={`${themeStyles.card} p-6 sm:p-8 rounded-3xl group hover:scale-105 transition-all duration-500 border hover:border-pink-500/30 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-pink-500/25 animate-pulse">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${themeStyles.text} mb-3 sm:mb-4`}>Domain Registration</h3>
                <p className={`${themeStyles.textSecondary} text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed`}>
                  Secure your perfect domain with instant activation, premium extensions, and competitive pricing starting from ₹299.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>Instant Domain Activation</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>Free DNS Management</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>Domain Privacy Protection</span>
                  </li>
                </ul>
                <button 
                  onClick={() => setCurrentView('domains')}
                  className={`w-full sm:w-auto ${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center group text-sm sm:text-base`}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Minecraft Hosting Card */}
            <div className={`${themeStyles.card} p-6 sm:p-8 rounded-3xl group hover:scale-105 transition-all duration-500 border hover:border-purple-500/30 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-purple-500/25 animate-pulse">
                  <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${themeStyles.text} mb-3 sm:mb-4`}>Minecraft Hosting</h3>
                <p className={`${themeStyles.textSecondary} text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed`}>
                  High-performance Minecraft servers with Indian locations, 99.9% uptime, and plans starting from just ₹49/month.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>Indian Server Locations</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>99.9% Uptime Guarantee</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>24/7 Premium Support</span>
                  </li>
                </ul>
                <button 
                  onClick={() => setCurrentView('hosting')}
                  className={`w-full sm:w-auto ${themeStyles.button} ${themeStyles.glowButton} text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center group text-sm sm:text-base`}
                >
                  Choose Plan
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* VPS Hosting Card */}
            <div className={`${themeStyles.card} p-6 sm:p-8 rounded-3xl group hover:scale-105 transition-all duration-500 border hover:border-orange-500/30 relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg shadow-orange-500/25 animate-pulse">
                  <Server className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${themeStyles.text} mb-3 sm:mb-4`}>VPS Hosting</h3>
                <p className={`${themeStyles.textSecondary} text-base sm:text-lg mb-4 sm:mb-6 leading-relaxed`}>
                  Enterprise-grade VPS with V4 processors, NVMe SSD storage, and instant deployment starting from ₹270/month.
                </p>
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>V4 Processors</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>NVMe SSD Storage</span>
                  </li>
                  <li className={`flex items-center ${themeStyles.textSecondary} text-sm sm:text-base`}>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-green-400" />
                    <span>Instant Deployment</span>
                  </li>
                </ul>
                <button 
                  onClick={() => setCurrentView('vps')}
                  className={`w-full sm:w-auto bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center group text-sm sm:text-base`}
                >
                  Launch VPS
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <div className={`${themeStyles.card} p-4 sm:p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${themeStyles.text} mb-1 sm:mb-2`}>10K+</div>
              <div className={`text-xs sm:text-sm ${themeStyles.textMuted}`}>Happy Customers</div>
            </div>
            <div className={`${themeStyles.card} p-4 sm:p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${themeStyles.text} mb-1 sm:mb-2`}>99.9%</div>
              <div className={`text-xs sm:text-sm ${themeStyles.textMuted}`}>Uptime</div>
            </div>
            <div className={`${themeStyles.card} p-4 sm:p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${themeStyles.text} mb-1 sm:mb-2`}>24/7</div>
              <div className={`text-xs sm:text-sm ${themeStyles.textMuted}`}>Support</div>
            </div>
            <div className={`${themeStyles.card} p-4 sm:p-6 rounded-2xl text-center group hover:scale-105 transition-all duration-300`}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className={`text-2xl sm:text-3xl font-bold ${themeStyles.text} mb-1 sm:mb-2`}>5★</div>
              <div className={`text-xs sm:text-sm ${themeStyles.textMuted}`}>Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${themeStyles.text} mb-4`}>What Our Customers Say</h2>
            <p className={`text-lg sm:text-xl ${themeStyles.textSecondary}`}>Join thousands of satisfied customers who trust us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className={`${themeStyles.card} p-6 sm:p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-yellow-500/30`}>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`${themeStyles.textSecondary} mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed`}>
                "Demon Node™ has been amazing! My server runs smoothly with zero downtime. Best hosting service I've used."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-white font-bold text-sm sm:text-base">AS</span>
                </div>
                <div>
                  <div className={`font-semibold ${themeStyles.text} text-sm sm:text-base`}>Arjun Sharma</div>
                  <div className={`text-xs sm:text-sm ${themeStyles.textMuted}`}>Gaming Community Owner</div>
                </div>
              </div>
            </div>

            <div className={`${themeStyles.card} p-6 sm:p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-yellow-500/30`}>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`${themeStyles.textSecondary} mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed`}>
                "Best hosting service in India. Great support and affordable pricing! Highly recommend to all gamers."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-white font-bold text-sm sm:text-base">PP</span>
                </div>
                <div>
                  <div className={`font-semibold ${themeStyles.text} text-sm sm:text-base`}>Priya Patel</div>
                  <div className={`text-xs sm:text-sm ${themeStyles.textMuted}`}>Content Creator</div>
                </div>
              </div>
            </div>

            <div className={`${themeStyles.card} p-6 sm:p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-yellow-500/30`}>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className={`${themeStyles.textSecondary} mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed`}>
                "Domain registration was instant and the hosting is blazing fast. Perfect for my Minecraft server!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <span className="text-white font-bold text-sm sm:text-base">RK</span>
                </div>
                <div>
                  <div className={`font-semibold ${themeStyles.text} text-sm sm:text-base`}>Rohit Kumar</div>
                  <div className={`text-xs sm:text-sm ${themeStyles.textMuted}`}>Server Administrator</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Get Started Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`${themeStyles.card} p-8 sm:p-12 rounded-3xl border hover:border-purple-500/30 transition-all duration-300`}>
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${themeStyles.text} mb-4 sm:mb-6`}>Ready to Get Started?</h2>
            <p className={`text-lg sm:text-xl ${themeStyles.textSecondary} mb-8 sm:mb-10 leading-relaxed`}>
              Join thousands of satisfied customers who trust Demon Node™ for their digital needs.
            </p>
            {/* Special Offers Banner */}
            {specialOffers.length > 0 && (
              <div className="w-full mb-8">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl text-center animate-pulse shadow-lg">
                  <h3 className="text-lg font-bold mb-2">🔥 Special Offers Available!</h3>
                  <div className="flex flex-wrap justify-center gap-4">
                    {specialOffers.slice(0, 3).map((offer, index) => (
                      <div key={index} className="bg-white/20 px-3 py-1 rounded-full text-sm">
                        <span className="font-semibold">{offer.planName}</span>: <span className="line-through opacity-75">{offer.originalPrice}</span> → <span className="font-bold text-yellow-300">{offer.discountPrice}</span> <span className="text-xs">({offer.discountPercentage}% OFF)</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-2 opacity-90">Limited time offers! Get them before they expire.</p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
              <button 
                onClick={() => setCurrentView('domains')}
                className={`w-full sm:w-auto ${themeStyles.pinkButton} ${themeStyles.pinkGlow} text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}
              >
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
                Register Domain
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => setCurrentView('hosting')}
                className={`w-full sm:w-auto ${themeStyles.button} ${themeStyles.glowButton} text-white px-6 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-sm sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group`}
              >
                <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform" />
                Start Hosting
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${themeStyles.card} border-t border-white/10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                  <img 
                    src="/05b5bc0e84997d92e62826cfce30b63a.webp" 
                    alt="JXFRCloud Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className={`text-lg sm:text-xl font-bold ${themeStyles.text}`}>JXFRCloud™</span>
              </div>
              <p className={`${themeStyles.textSecondary} text-xs sm:text-sm leading-relaxed`}>
                Premium hosting solutions designed for Indian gamers and businesses.
              </p>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-3 sm:mb-4 text-sm sm:text-base`}>Services</h4>
              <ul className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${themeStyles.textSecondary}`}>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Minecraft Hosting</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">VPS Hosting</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Domain Registration</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">24/7 Support</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-3 sm:mb-4 text-sm sm:text-base`}>Company</h4>
              <ul className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${themeStyles.textSecondary}`}>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold ${themeStyles.text} mb-3 sm:mb-4 text-sm sm:text-base`}>Connect</h4>
              <ul className={`space-y-1 sm:space-y-2 text-xs sm:text-sm ${themeStyles.textSecondary}`}>
                <li>
                  <a 
                    href="https://discord.gg/Qy6tuNJmwJ" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-purple-400 transition-colors cursor-pointer flex items-center"
                  >
                    <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Discord Server
                    <ExternalLink className="w-2 h-2 sm:w-3 sm:h-3 ml-1" />
                  </a>
                </li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Support Tickets</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Status Page</li>
                <li className="hover:text-purple-400 transition-colors cursor-pointer">Documentation</li>
              </ul>
            </div>
          </div>
          <div className={`border-t border-white/10 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center ${themeStyles.textSecondary} text-xs sm:text-sm`}>
            <p>&copy; 2024 JXFRCloud™. All rights reserved. Made with <Heart className="w-3 h-3 sm:w-4 sm:h-4 inline text-red-400" /> for Indian Gamers.</p>
            <p class="text-sm">Powered By JXFR</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

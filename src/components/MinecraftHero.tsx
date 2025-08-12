import React from 'react';
import { Gamepad2, Zap, Shield, Users, ArrowRight } from 'lucide-react';

interface MinecraftHeroProps {
  theme?: string;
  onScrollToPlans?: () => void;
}

const MinecraftHero: React.FC<MinecraftHeroProps> = ({ theme = 'dark', onScrollToPlans }) => {
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
          glowButton: 'shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          glowButton: 'shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40'
        };
    }
  };

  const themeStyles = getThemeClasses();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        {/* Premium Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-full px-6 py-3 mb-8 animate-fade-in-up">
          <Gamepad2 className="w-5 h-5 text-purple-400" />
          <span className={`text-sm font-semibold ${themeStyles.text}`}>🎮 Premium Minecraft Hosting</span>
        </div>

        <div className="text-center mb-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${themeStyles.text} mb-2`}>ᴠᴏʀᴛᴇx ᴄʟᴏᴜᴅ ™</h1>
          <h2 className={`text-4xl md:text-6xl font-bold ${themeStyles.text} mb-6 leading-tight`}>
            Unleash Your{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Minecraft World
            </span>
          </h2>
        </div>
        
        <p className={`text-xl md:text-2xl ${themeStyles.textSecondary} mb-12 max-w-4xl mx-auto leading-relaxed`}>
          Experience lag-free gaming with our premium Minecraft hosting. Indian servers, instant setup, and plans starting from just ₹49/month.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          <div className={`${themeStyles.card} p-6 rounded-2xl group hover:scale-105 transition-all duration-300`}>
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-bold ${themeStyles.text} mb-2`}>Lightning Fast</h3>
            <p className={`text-sm ${themeStyles.textMuted}`}>NVMe SSD storage for instant world loading</p>
          </div>

          <div className={`${themeStyles.card} p-6 rounded-2xl group hover:scale-105 transition-all duration-300`}>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-bold ${themeStyles.text} mb-2`}>DDoS Protected</h3>
            <p className={`text-sm ${themeStyles.textMuted}`}>Enterprise-grade protection included</p>
          </div>

          <div className={`${themeStyles.card} p-6 rounded-2xl group hover:scale-105 transition-all duration-300`}>
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className={`text-lg font-bold ${themeStyles.text} mb-2`}>24/7 Support</h3>
            <p className={`text-sm ${themeStyles.textMuted}`}>Expert help whenever you need it</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button 
            onClick={onScrollToPlans}
            className={`${themeStyles.button} ${themeStyles.glowButton} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center group`}
          >
            <Gamepad2 className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            View Plans
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className={`text-center ${themeStyles.textSecondary}`}>
            <div className="text-sm">Starting from</div>
            <div className="text-2xl font-bold text-green-400">₹49/month</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinecraftHero;
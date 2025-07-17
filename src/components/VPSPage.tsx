import React from 'react';
import { ArrowLeft, Server, Zap, Shield, Users, CheckCircle, Star, Crown, Cpu, HardDrive, Wifi, Database } from 'lucide-react';
import VPSHero from './VPSHero';
import VPSPlanTabs from './VPSPlanTabs';

interface VPSPageProps {
  theme?: string;
  onBack: () => void;
  onPlanSelect: (plan: any) => void;
}

const VPSPage: React.FC<VPSPageProps> = ({ theme = 'dark', onBack, onPlanSelect }) => {
  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
          card: 'bg-white/80 backdrop-blur-xl border-white/40',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/80',
          textMuted: 'text-white/60',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
        };
    }
  };

  const themeStyles = getThemeClasses();

  return (
    <div className={`min-h-screen ${themeStyles.bg} font-['Inter',sans-serif]`}>
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className={`flex items-center ${themeStyles.textSecondary} hover:text-purple-400 transition-colors mb-8`}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>
      </div>

      {/* VPS Hero Section */}
      <VPSHero 
        theme={theme} 
        onScrollToPlans={() => document.getElementById('vps-plans')?.scrollIntoView({ behavior: 'smooth' })} 
      />

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-6`}>
              Why Choose Our VPS Hosting?
            </h2>
            <p className={`text-xl ${themeStyles.textSecondary} max-w-3xl mx-auto`}>
              Experience enterprise-grade VPS hosting with unmatched performance and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-green-500/30`}>
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>High Performance</h3>
              <p className={`${themeStyles.textSecondary} mb-6 leading-relaxed`}>
                Powered by latest V4 processors and NVMe SSD storage for blazing-fast performance.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">NVMe SSD Storage</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">V4 Processors</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">200 Mbps Network</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-blue-500/30`}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>Enterprise Security</h3>
              <p className={`${themeStyles.textSecondary} mb-6 leading-relaxed`}>
                Advanced DDoS protection and security measures keep your VPS safe from attacks.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">DDoS Protection</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Firewall Security</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Regular Backups</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-purple-500/30`}>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>24/7 Expert Support</h3>
              <p className={`${themeStyles.textSecondary} mb-6 leading-relaxed`}>
                Our dedicated support team is always ready to help you with any issues or questions.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">24/7 Live Support</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Discord Community</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Expert Assistance</span>
                </li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-orange-500/30`}>
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25">
                <Server className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>Instant Delivery</h3>
              <p className={`${themeStyles.textSecondary} mb-6 leading-relaxed`}>
                Get your VPS up and running within minutes of order confirmation.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Instant Setup</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Root Access</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Full Control</span>
                </li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-pink-500/30`}>
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-pink-500/25">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>Scalable Resources</h3>
              <p className={`${themeStyles.textSecondary} mb-6 leading-relaxed`}>
                Easily scale your resources up or down based on your requirements.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Flexible Scaling</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Resource Monitoring</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Auto Scaling</span>
                </li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className={`${themeStyles.card} p-8 rounded-2xl group hover:scale-105 transition-all duration-300 border hover:border-indigo-500/30`}>
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/25">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>99.9% Uptime</h3>
              <p className={`${themeStyles.textSecondary} mb-6 leading-relaxed`}>
                Reliable infrastructure ensures your VPS stays online when you need it most.
              </p>
              <ul className="space-y-2">
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Redundant Systems</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">Monitoring 24/7</span>
                </li>
                <li className={`flex items-center ${themeStyles.textSecondary}`}>
                  <CheckCircle className="w-4 h-4 mr-3 text-green-400" />
                  <span className="text-sm">SLA Guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* VPS Plans */}
      <section id="vps-plans">
        <VPSPlanTabs theme={theme} onPlanSelect={onPlanSelect} />
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`${themeStyles.card} p-12 rounded-3xl border hover:border-purple-500/30 transition-all duration-300`}>
            <h2 className={`text-4xl md:text-5xl font-bold ${themeStyles.text} mb-6`}>Ready to Launch Your VPS?</h2>
            <p className={`text-xl ${themeStyles.textSecondary} mb-10 leading-relaxed`}>
              Join thousands of satisfied customers who trust JXFRCloud™ for your VPS hosting needs.
            </p>
            <button 
              onClick={() => document.getElementById('vps-plans')?.scrollIntoView({ behavior: 'smooth' })}
              className={`${themeStyles.button} text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mx-auto group`}
            >
              <Server className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
              Choose Your Plan
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VPSPage;

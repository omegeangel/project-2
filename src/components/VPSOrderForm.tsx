import React, { useState } from 'react';
import { ArrowLeft, User, Mail, MessageCircle, Send, CheckCircle, Server, ExternalLink, Cpu, HardDrive, Wifi, Database, Zap, Copy } from 'lucide-react';
import { authManager, type AuthState } from '../utils/auth';
import { superDatabase } from '../utils/database';

interface VPSOrderFormProps {
  selectedPlan: any;
  onBack: () => void;
  theme: string;
}

const VPSOrderForm: React.FC<VPSOrderFormProps> = ({ selectedPlan, onBack, theme }) => {
  const [authState, setAuthState] = useState<AuthState>(authManager.getAuthState());
  const [formData, setFormData] = useState({
    firstName: authManager.getFirstName(),
    lastName: authManager.getLastName(),
    email: authManager.getEmail(),
    discordUsername: authManager.getDiscordUsername(),
    serverPurpose: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [copied, setCopied] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState('');

  const generateOrderId = () => {
    const prefix = 'VPS';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Prevent editing Discord username if user is logged in
    if (name === 'discordUsername' && authState.isAuthenticated) {
      return;
    }
    
    // Prevent editing email if user is logged in
    if (name === 'email' && authState.isAuthenticated) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    
    const coupon = superDatabase.validateCoupon(couponCode.trim().toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setCouponError('Invalid or expired coupon code');
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  const calculateTotal = () => {
    let basePrice = parseInt(selectedPlan.price.replace(/[₹,]/g, '').split('/')[0]);
    
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        basePrice = basePrice - (basePrice * appliedCoupon.discountValue / 100);
      } else {
        basePrice = Math.max(0, basePrice - appliedCoupon.discountValue);
      }
    }
    
    return Math.round(basePrice);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          input: 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
        };
      case 'glass':
        return {
          bg: 'bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-3xl',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-white/70',
          button: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-600/80 hover:to-pink-600/80 backdrop-blur-sm',
          input: 'bg-white/5 border-white/10 text-white placeholder-white/50'
        };
      default: // dark
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/10 backdrop-blur-md border-white/20',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          input: 'bg-white/10 border-white/20 text-white placeholder-gray-400'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const getPlanTypeIcon = (planType: string) => {
    switch (planType) {
      case 'cheap':
        return <Server className="w-5 h-5 text-green-400" />;
      case 'powered':
        return <Zap className="w-5 h-5 text-orange-400" />;
      default:
        return <Server className="w-5 h-5 text-blue-400" />;
    }
  };

  const sendToDiscord = async (generatedOrderId: string) => {
    const webhookUrl = 'https://discord.com/api/webhooks/1393999338329604126/zo9VrQY1cyoLp4ZgLpf8BytjQKF_nH6rYgZHAVDhF8L2IIOod2fdbWv04ds072olZ6Wl';

    const orderDetails = {
      embeds: [
        {
          title: "🖥️ New VPS Hosting Order!",
          color: 0x7C3AED,
          fields: [
            {
              name: "🆔 Order ID",
              value: `**${generatedOrderId}**`,
              inline: false
            },
            {
              name: "👤 Customer Information",
              value: `**Name:** ${formData.firstName} ${formData.lastName}\n**Email:** ${formData.email}\n**Discord:** ${formData.discordUsername}`,
              inline: false
            },
            {
              name: "🖥️ VPS Plan Details",
              value: `**Plan:** ${selectedPlan.name}\n**Type:** ${selectedPlan.planType || 'Standard'}\n**RAM:** ${selectedPlan.ram}\n**CPU:** ${selectedPlan.cpu}\n**Storage:** ${selectedPlan.storage}\n**Bandwidth:** ${selectedPlan.bandwidth}${selectedPlan.processor ? `\n**Processor:** ${selectedPlan.processor}` : ''}${selectedPlan.network ? `\n**Network:** ${selectedPlan.network}` : ''}`,
              inline: true
            },
            {
              name: "💰 Pricing",
              value: `**Price:** ${selectedPlan.price}${selectedPlan.priceUSD ? `\n**USD Price:** ${selectedPlan.priceUSD}` : ''}`,
              inline: true
            },
            {
              name: "🎯 Server Purpose",
              value: `${formData.serverPurpose || 'Not specified'}`,
              inline: false
            }
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "ᴠᴏʀᴛᴇx ᴄʟᴏᴜᴅ ™ VPS Hosting"
          }
        }
      ]
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderDetails)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        throw new Error('Failed to send to Discord');
      }
    } catch (error) {
      console.error('Error sending to Discord:', error);
      setIsSubmitted(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const generatedOrderId = generateOrderId();
    setOrderId(generatedOrderId);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use coupon if applied
    if (appliedCoupon) {
      superDatabase.useCoupon(appliedCoupon.code);
    }
    
    // Create order in database
    if (authState.isAuthenticated && authState.user) {
      const user = superDatabase.getUserByDiscordId(authState.user.id);
      if (user) {
        superDatabase.createOrder({
          userId: user.id,
          type: 'vps',
          planName: selectedPlan.name,
          price: `₹${calculateTotal()}/mo`,
          status: 'pending',
          customerInfo: formData,
          orderId: generatedOrderId
        });
      }
    }
    
    await sendToDiscord(generatedOrderId);
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-6 sm:p-8 text-center`}>
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4`}>VPS Order Submitted!</h2>
          
          {/* Order ID Display */}
          <div className={`${themeStyles.card} p-4 rounded-xl mb-6 border`}>
            <p className={`text-sm ${themeStyles.textSecondary} mb-2`}>Your Order ID:</p>
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-lg font-bold ${themeStyles.text} font-mono`}>#{orderId}</span>
              <button
                onClick={() => copyToClipboard(`#${orderId}`)}
                className={`p-2 ${themeStyles.button} text-white rounded-lg transition-all duration-300 hover:scale-105`}
                title="Copy Order ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            {copied && (
              <p className="text-green-400 text-xs mt-2">Copied to clipboard!</p>
            )}
          </div>

          <p className={`${themeStyles.textSecondary} mb-6 text-sm sm:text-base`}>
            Your VPS hosting order has been received. Create a ticket on Discord with this ID <strong>#{orderId}</strong> and our team will contact you to confirm your order and set up your server.
          </p>
          
          <div className="mb-6">
            <a
              href="https://discord.gg/Qy6tuNJmwJ"
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full ${themeStyles.button} text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center mb-4 text-sm sm:text-base`}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Join Discord Server
              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
            </a>
            <p className={`text-xs sm:text-sm ${themeStyles.textSecondary}`}>
              Join our Discord server and create a ticket with your order ID to get support from our team.
            </p>
          </div>

          <button
            onClick={onBack}
            className={`w-full ${themeStyles.button} text-white py-3 rounded-lg font-semibold transition-all duration-300 text-sm sm:text-base`}
          >
            Back to VPS Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg} py-4 sm:py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className={`flex items-center ${themeStyles.textSecondary} hover:text-purple-400 transition-colors text-sm sm:text-base`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Back to VPS Plans
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          {/* Order Summary */}
          <div className={`${themeStyles.card} rounded-2xl p-4 sm:p-6 h-fit order-2 xl:order-1`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4 sm:mb-6`}>VPS Summary</h2>
            
            <div className="space-y-4 mb-4 sm:mb-6">
              <div className={`flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 ${themeStyles.card} rounded-xl`}>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getPlanTypeIcon(selectedPlan.planType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-base sm:text-lg font-semibold ${themeStyles.text} truncate`}>{selectedPlan.name}</h3>
                  <p className={`${themeStyles.textSecondary} text-sm capitalize`}>{selectedPlan.planType || 'Standard'} VPS</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg sm:text-xl font-bold ${themeStyles.text}`}>
                    ₹{calculateTotal()}
                  </div>
                  <div className={`text-xs sm:text-sm ${themeStyles.textSecondary}`}>/month</div>
                  {selectedPlan.priceUSD && (
                    <div className={`text-xs ${themeStyles.textMuted}`}>{selectedPlan.priceUSD}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>RAM:</span>
                  <span className="font-medium">{selectedPlan.ram}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>CPU:</span>
                  <span className="font-medium">{selectedPlan.cpu}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>Storage:</span>
                  <span className="font-medium">{selectedPlan.storage}</span>
                </div>
                <div className={`flex justify-between ${themeStyles.textSecondary}`}>
                  <span>Bandwidth:</span>
                  <span className="font-medium">{selectedPlan.bandwidth}</span>
                </div>
                {selectedPlan.processor && (
                  <div className={`flex justify-between ${themeStyles.textSecondary} col-span-2`}>
                    <span>Processor:</span>
                    <span className="font-medium">{selectedPlan.processor}</span>
                  </div>
                )}
                {selectedPlan.network && (
                  <div className={`flex justify-between ${themeStyles.textSecondary} col-span-2`}>
                    <span>Network:</span>
                    <span className="font-medium">{selectedPlan.network}</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`border-t ${theme === 'light' ? 'border-gray-200' : 'border-white/20'} pt-4`}>
              {/* Coupon Section */}
              <div className="mb-4">
                <h4 className={`text-sm font-semibold ${themeStyles.text} mb-3`}>Coupon Code</h4>
                {!appliedCoupon ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className={`flex-1 px-3 py-2 ${themeStyles.input} border rounded-lg text-sm`}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <div className={`${themeStyles.card} p-3 rounded-lg border flex items-center justify-between`}>
                    <div>
                      <span className={`text-sm font-semibold ${themeStyles.text}`}>{appliedCoupon.code}</span>
                      <span className="text-sm text-green-400 ml-2">
                        -{appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`}
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="text-red-400 text-xs mt-1">{couponError}</p>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className={`text-lg sm:text-xl font-bold ${themeStyles.text}`}>Total</span>
                <div className="text-right">
                  {appliedCoupon && (
                    <div className={`text-sm ${themeStyles.textMuted} line-through mb-1`}>
                      {selectedPlan.price}
                    </div>
                  )}
                  <span className="text-xl sm:text-2xl font-bold text-purple-400">
                    ₹{calculateTotal()}/mo
                  </span>
                  {selectedPlan.priceUSD && (
                    <div className={`text-sm ${themeStyles.textMuted}`}>{selectedPlan.priceUSD}</div>
                  )}
                </div>
              </div>
            </div>

            <div className={`mt-4 sm:mt-6 p-3 sm:p-4 ${theme === 'light' ? 'bg-blue-50 border-blue-200' : 'bg-blue-500/20 border-blue-500/30'} rounded-xl border`}>
              <h4 className={`${theme === 'light' ? 'text-blue-800' : 'text-blue-300'} font-semibold mb-2 text-sm sm:text-base`}>What's Included:</h4>
              <ul className={`text-xs sm:text-sm ${theme === 'light' ? 'text-blue-700' : 'text-blue-200'} space-y-1`}>
                <li>• Root Access & Full Control</li>
                <li>• DDoS Protection</li>
                <li>• 24/7 Support</li>
                <li>• Instant Setup</li>
                <li>• 99.9% Uptime SLA</li>
              </ul>
            </div>
          </div>

          {/* Order Form */}
          <div className={`${themeStyles.card} rounded-2xl p-4 sm:p-6 order-1 xl:order-2`}>
            <h2 className={`text-xl sm:text-2xl font-bold ${themeStyles.text} mb-4 sm:mb-6`}>Customer Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
                    placeholder="Enter first name"
                    readOnly={authState.isAuthenticated && !!authManager.getFirstName()}
                  />
                </div>
                <div>
                  <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                    <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base`}
                    placeholder="Enter last name"
                    readOnly={authState.isAuthenticated && !!authManager.getLastName()}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${authState.isAuthenticated ? 'opacity-75 cursor-not-allowed' : ''}`}
                  placeholder="Enter email address"
                  readOnly={authState.isAuthenticated}
                />
                {authState.isAuthenticated && (
                  <p className={`text-xs ${themeStyles.textMuted} mt-1 flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                    Auto-filled from Discord login
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Discord Username *
                </label>
                <input
                  type="text"
                  name="discordUsername"
                  value={formData.discordUsername}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${authState.isAuthenticated ? 'opacity-75 cursor-not-allowed font-mono' : ''}`}
                  placeholder="Enter Discord username"
                  readOnly={authState.isAuthenticated}
                />
                {authState.isAuthenticated && (
                  <p className={`text-xs ${themeStyles.textMuted} mt-1 flex items-center`}>
                    <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                    Auto-filled from Discord login
                  </p>
                )}
              </div>

              <div>
                <label className={`block text-xs sm:text-sm font-medium ${themeStyles.textSecondary} mb-2`}>
                  <Server className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
                  Server Purpose (Optional)
                </label>
                <textarea
                  name="serverPurpose"
                  value={formData.serverPurpose}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 ${themeStyles.input} border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base resize-none`}
                  placeholder="What will you use this VPS for? (e.g., web hosting, development, applications)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full ${themeStyles.button} disabled:from-gray-500 disabled:to-gray-600 text-white py-3 sm:py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center text-sm sm:text-base`}
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                    Processing Order...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Submit VPS Order
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VPSOrderForm;

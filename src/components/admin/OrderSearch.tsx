import React, { useState } from 'react';
import { Search, Eye, CheckCircle, Clock, User, Mail, MessageCircle, Calendar, Package } from 'lucide-react';
import { superDatabase } from '../../utils/database';
import { format } from 'date-fns';

interface OrderSearchProps {
  theme?: string;
}


const OrderSearch: React.FC<OrderSearchProps> = ({ theme = 'dark' }) => {
  const [searchId, setSearchId] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          input: 'bg-white/80 border-gray-300 text-gray-900'
        };
      default:
        return {
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          input: 'bg-white/10 border-white/20 text-white'
        };
    }
  };

  const themeStyles = getThemeClasses();

  const searchOrder = async () => {
    if (!searchId.trim()) return;
    
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const allOrders = superDatabase.getAllOrders();
      const foundOrder = allOrders.find(o => o.orderId === searchId.trim() || o.id === searchId.trim());
      
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Error searching for order');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmOrder = async () => {
    if (!order) return;

    try {
      const success = superDatabase.confirmOrder(order.orderId);
      if (success) {
        setOrder({ ...order, status: 'confirmed' });
      }
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  return (
    <div>
      <h1 className={`text-3xl font-bold ${themeStyles.text} mb-8`}>Order Search</h1>
      
      {/* Search Section */}
      <div className={`${themeStyles.card} p-6 rounded-2xl border mb-8`}>
        <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Search Order by ID</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter order ID..."
              className={`w-full px-4 py-3 ${themeStyles.input} border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500`}
              onKeyPress={(e) => e.key === 'Enter' && searchOrder()}
            />
          </div>
          <button
            onClick={searchOrder}
            disabled={loading}
            className={`${themeStyles.button} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>Search</span>
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
            <p className="text-red-300">{error}</p>
          </div>
        )}
      </div>

      {/* Order Details */}
      {order && (
        <div className={`${themeStyles.card} rounded-2xl border overflow-hidden`}>
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <h3 className={`text-xl font-bold ${themeStyles.text}`}>Order Details</h3>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status === 'confirmed' ? (
                    <CheckCircle className="w-4 h-4 mr-1" />
                  ) : (
                    <Clock className="w-4 h-4 mr-1" />
                  )}
                  {order.status}
                </span>
                {order.status === 'pending' && (
                  <button
                    onClick={confirmOrder}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Confirm Order
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div>
                <h4 className={`text-lg font-semibold ${themeStyles.text} mb-4 flex items-center`}>
                  <User className="w-5 h-5 mr-2" />
                  Customer Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Name</label>
                    <p className={`${themeStyles.textSecondary}`}>
                      {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Email</label>
                    <p className={`${themeStyles.textSecondary} flex items-center`}>
                      <Mail className="w-4 h-4 mr-2" />
                      {order.customerInfo?.email}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Discord</label>
                    <p className={`${themeStyles.textSecondary} flex items-center font-mono`}>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {order.customerInfo?.discordUsername}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Order Date</label>
                    <p className={`${themeStyles.textSecondary} flex items-center`}>
                      <Calendar className="w-4 h-4 mr-2" />
                      {order.createdAt ? format(new Date(order.createdAt), 'PPP') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h4 className={`text-lg font-semibold ${themeStyles.text} mb-4 flex items-center`}>
                  <Package className="w-5 h-5 mr-2" />
                  Order Information
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Order ID</label>
                    <p className={`${themeStyles.textSecondary} font-mono`}>#{order.orderId}</p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Plan Name</label>
                    <p className={`${themeStyles.textSecondary}`}>{order.planName}</p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Amount</label>
                    <p className={`${themeStyles.textSecondary} text-lg font-semibold`}>
                      {order.price || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Type</label>
                    <p className={`${themeStyles.textSecondary} capitalize`}>{order.type}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            {order.customerInfo && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className={`text-lg font-semibold ${themeStyles.text} mb-4`}>Additional Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.customerInfo.serverName && (
                    <div>
                      <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Server Name</label>
                      <p className={`${themeStyles.textSecondary}`}>{order.customerInfo.serverName}</p>
                    </div>
                  )}
                  {order.customerInfo.serverPurpose && (
                    <div>
                      <label className={`block text-sm font-medium ${themeStyles.textMuted} mb-1`}>Server Purpose</label>
                      <p className={`${themeStyles.textSecondary}`}>{order.customerInfo.serverPurpose}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSearch;
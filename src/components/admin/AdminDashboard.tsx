import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Search,
  Settings,
  LogOut,
  Moon,
  Sun,
  Download,
  UserPlus,
  Shield,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { superDatabase } from '../../utils/database';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import OrderSearch from './OrderSearch';
import UserManagement from './UserManagement';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  totalRevenue: number;
}

interface Order {
  id: string;
  username: string;
  planName: string;
  status: 'pending' | 'confirmed';
  amount: number;
  createdAt: any;
  email: string;
  discordTag: string;
  addons?: any;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('dark');
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const getThemeClasses = () => {
    switch (theme) {
      case 'light':
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-blue-50',
          card: 'bg-white/90 backdrop-blur-sm border-gray-200',
          text: 'text-gray-900',
          textSecondary: 'text-gray-600',
          textMuted: 'text-gray-500',
          button: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600',
          sidebar: 'bg-white/95 border-gray-200'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
          card: 'bg-white/5 backdrop-blur-xl border-white/10',
          text: 'text-white',
          textSecondary: 'text-gray-300',
          textMuted: 'text-gray-400',
          button: 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
          sidebar: 'bg-white/5 border-white/10'
        };
    }
  };

  const themeStyles = getThemeClasses();

  useEffect(() => {
    // Load data from SuperDatabase
    const loadDashboardData = () => {
      try {
        const analytics = superDatabase.getAnalytics();
        const allOrders = superDatabase.getAllOrders();
        const allUsers = superDatabase.getAllUsers();
        
        // Calculate revenue from confirmed orders
        const revenue = allOrders
          .filter(order => order.status === 'confirmed')
          .reduce((sum, order) => {
            const price = parseInt(order.price.replace(/[₹,]/g, '').split('/')[0]) || 0;
            return sum + price;
          }, 0);

        setStats({
          totalUsers: analytics.totalUsers,
          totalOrders: analytics.totalOrders,
          pendingOrders: analytics.pendingOrders,
          confirmedOrders: analytics.confirmedOrders,
          totalRevenue: revenue
        });

        // Get recent orders (last 5)
        const recent = allOrders.slice(0, 5).map(order => ({
          id: order.id,
          userId: order.userId,
          type: order.type,
          planName: order.planName,
          status: order.status,
          price: order.price,
          createdAt: order.createdAt,
          orderId: order.orderId,
          customerInfo: order.customerInfo
        }));
        
        setRecentOrders(recent);
        setLoading(false);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(loadDashboardData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const confirmOrder = async (orderIdToConfirm: string) => {
    try {
      const success = superDatabase.confirmOrder(orderIdToConfirm);
      if (success) {
        // Refresh data
        const analytics = superDatabase.getAnalytics();
        const allOrders = superDatabase.getAllOrders();
        
        const revenue = allOrders
          .filter(order => order.status === 'confirmed')
          .reduce((sum, order) => {
            const price = parseInt(order.price.replace(/[₹,]/g, '').split('/')[0]) || 0;
            return sum + price;
          }, 0);

        setStats({
          totalUsers: analytics.totalUsers,
          totalOrders: analytics.totalOrders,
          pendingOrders: analytics.pendingOrders,
          confirmedOrders: analytics.confirmedOrders,
          totalRevenue: revenue
        });

        const recent = allOrders.slice(0, 5).map(order => ({
          id: order.id,
          userId: order.userId,
          type: order.type,
          planName: order.planName,
          status: order.status,
          price: order.price,
          createdAt: order.createdAt,
          orderId: order.orderId,
          customerInfo: order.customerInfo
        }));
        
        setRecentOrders(recent);
      }
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };

  const exportData = async (type: 'orders' | 'users') => {
    try {
      let data: any[] = [];
      
      if (type === 'orders') {
        data = superDatabase.getAllOrders();
      } else {
        data = superDatabase.getAllUsers();
      }
      
      const csv = [
        Object.keys(data[0] || {}).join(','),
        ...data.map(item => Object.values(item).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const chartData = [
    { name: 'Pending', value: stats.pendingOrders, color: '#f59e0b' },
    { name: 'Confirmed', value: stats.confirmedOrders, color: '#10b981' }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 12000 },
    { month: 'Feb', revenue: 19000 },
    { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 25000 },
    { month: 'May', revenue: 22000 },
    { month: 'Jun', revenue: 30000 }
  ];

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'orders', label: 'Order Search', icon: Search },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!user?.isAdmin) {
    return (
      <div className={`min-h-screen ${themeStyles.bg} flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${themeStyles.card} rounded-2xl p-8 text-center border`}>
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold ${themeStyles.text} mb-4`}>Access Denied</h2>
          <p className={`${themeStyles.textSecondary} mb-6`}>
            You don't have permission to access the admin dashboard.
          </p>
          <button
            onClick={logout}
            className={`${themeStyles.button} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300`}
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeStyles.bg}`}>
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-full w-64 ${themeStyles.sidebar} border-r backdrop-blur-xl z-50`}>
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${themeStyles.text}`}>Admin Panel</h1>
              <p className={`text-xs ${themeStyles.textMuted}`}>JXFRCloud™</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : `${themeStyles.textSecondary} hover:bg-white/10`
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Info & Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10">
          <div className={`${themeStyles.card} p-4 rounded-xl border mb-4`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${themeStyles.text} truncate`}>
                  {user?.email}
                </p>
                <p className={`text-xs ${themeStyles.textMuted}`}>
                  {user?.isSuperAdmin ? 'Super Admin' : 'Admin'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex-1 ${themeStyles.card} border p-2 rounded-lg hover:bg-white/10 transition-colors`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-yellow-400 mx-auto" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400 mx-auto" />
              )}
            </button>
            <button
              onClick={logout}
              className="flex-1 bg-red-500/20 border border-red-500/30 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <LogOut className="w-4 h-4 text-red-400 mx-auto" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div>
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold ${themeStyles.text} mb-2`}>Dashboard Overview</h1>
              <p className={`${themeStyles.textSecondary}`}>
                Welcome back, {user?.email}. Here's what's happening with your platform.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className={`${themeStyles.card} p-6 rounded-2xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-2xl font-bold ${themeStyles.text}`}>{stats.totalUsers}</span>
                </div>
                <h3 className={`font-semibold ${themeStyles.text} mb-1`}>Total Users</h3>
                <p className={`text-sm ${themeStyles.textMuted}`}>Registered accounts</p>
              </div>

              <div className={`${themeStyles.card} p-6 rounded-2xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-2xl font-bold ${themeStyles.text}`}>{stats.totalOrders}</span>
                </div>
                <h3 className={`font-semibold ${themeStyles.text} mb-1`}>Total Orders</h3>
                <p className={`text-sm ${themeStyles.textMuted}`}>All time orders</p>
              </div>

              <div className={`${themeStyles.card} p-6 rounded-2xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-2xl font-bold ${themeStyles.text}`}>{stats.pendingOrders}</span>
                </div>
                <h3 className={`font-semibold ${themeStyles.text} mb-1`}>Pending Orders</h3>
                <p className={`text-sm ${themeStyles.textMuted}`}>Awaiting confirmation</p>
              </div>

              <div className={`${themeStyles.card} p-6 rounded-2xl border hover:scale-105 transition-all duration-300`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-2xl font-bold ${themeStyles.text}`}>₹{stats.totalRevenue.toLocaleString()}</span>
                </div>
                <h3 className={`font-semibold ${themeStyles.text} mb-1`}>Total Revenue</h3>
                <p className={`text-sm ${themeStyles.textMuted}`}>Confirmed orders</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className={`${themeStyles.card} p-6 rounded-2xl border`}>
                <h3 className={`text-xl font-bold ${themeStyles.text} mb-6`}>Order Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className={`${themeStyles.card} p-6 rounded-2xl border`}>
                <h3 className={`text-xl font-bold ${themeStyles.text} mb-6`}>Revenue Growth</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Orders */}
            <div className={`${themeStyles.card} rounded-2xl border overflow-hidden`}>
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className={`text-xl font-bold ${themeStyles.text}`}>Recent Orders</h3>
                  <button
                    onClick={() => exportData('orders')}
                    className={`${themeStyles.button} text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Order ID</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Customer</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Plan</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Status</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Date</th>
                      <th className={`text-left p-4 font-semibold ${themeStyles.text}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                            <span className={themeStyles.textMuted}>Loading orders...</span>
                          </div>
                        </td>
                      </tr>
                    ) : recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className={`p-8 text-center ${themeStyles.textMuted}`}>
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr key={order.orderId} className="border-b border-white/5 hover:bg-white/5">
                          <td className={`p-4 ${themeStyles.text} font-mono text-sm`}>
                            #{order.orderId}
                          </td>
                          <td className={`p-4 ${themeStyles.textSecondary}`}>
                            {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                          </td>
                          <td className={`p-4 ${themeStyles.textSecondary}`}>
                            {order.planName}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status === 'confirmed' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {order.status}
                            </span>
                          </td>
                          <td className={`p-4 ${themeStyles.textSecondary} text-sm`}>
                            {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                          </td>
                          <td className="p-4">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => confirmOrder(order.orderId)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold transition-colors"
                              >
                                Confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && <OrderSearch theme={theme} />}
        {activeTab === 'users' && <UserManagement theme={theme} />}
        
        {activeTab === 'settings' && (
          <div>
            <h1 className={`text-3xl font-bold ${themeStyles.text} mb-8`}>Settings</h1>
            <div className={`${themeStyles.card} p-6 rounded-2xl border`}>
              <h3 className={`text-xl font-bold ${themeStyles.text} mb-4`}>Admin Information</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Email</label>
                  <p className={`${themeStyles.text}`}>{user?.email}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>UID</label>
                  <p className={`${themeStyles.text} font-mono text-sm`}>{user?.uid}</p>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${themeStyles.textSecondary} mb-1`}>Role</label>
                  <p className={`${themeStyles.text}`}>
                    {user?.isSuperAdmin ? 'Super Administrator' : 'Administrator'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

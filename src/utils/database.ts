// SuperDatabase - Enhanced with cross-device synchronization
interface User {
  id: string;
  discordId: string;
  username: string;
  email: string;
  membershipType: 'normal' | 'premium';
  purchases: Purchase[];
  createdAt: string;
  lastSeen: string;
  deviceInfo?: string;
}

interface Purchase {
  id: string;
  type: 'minecraft' | 'vps' | 'domain';
  planName: string;
  price: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  purchaseDate: string;
  renewalDate: string;
  orderId: string;
}

interface Order {
  id: string;
  userId: string;
  type: 'minecraft' | 'vps' | 'domain';
  planName: string;
  price: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  customerInfo: any;
  createdAt: string;
  orderId: string;
  deviceInfo?: string;
}

interface SpecialOffer {
  id: string;
  type: 'minecraft' | 'vps' | 'domain';
  planName: string;
  originalPrice: string;
  discountPrice: string;
  discountPercentage: number;
  isActive: boolean;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  expiryDate: string;
  createdAt: string;
}

interface Plan {
  id: string;
  type: 'minecraft' | 'vps' | 'domain';
  category: string;
  name: string;
  price: string;
  specs: any;
  isActive: boolean;
}

interface DatabaseState {
  users: [string, User][];
  orders: [string, Order][];
  specialOffers: [string, SpecialOffer][];
  coupons: [string, Coupon][];
  plans: [string, Plan][];
  lastUpdated: string;
}

class SuperDatabase {
  private static instance: SuperDatabase;
  private users: Map<string, User> = new Map();
  private orders: Map<string, Order> = new Map();
  private specialOffers: Map<string, SpecialOffer> = new Map();
  private coupons: Map<string, Coupon> = new Map();
  private plans: Map<string, Plan> = new Map();
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncTime: number = 0;

  static getInstance(): SuperDatabase {
    if (!SuperDatabase.instance) {
      SuperDatabase.instance = new SuperDatabase();
    }
    return SuperDatabase.instance;
  }

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultPlans();
    this.initializeDefaultOffers();
    this.startCrossDeviceSync();
    
    // Listen for storage changes from other tabs/devices
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Broadcast changes to other tabs
    window.addEventListener('beforeunload', () => {
      this.broadcastUpdate();
    });
  }

  private startCrossDeviceSync() {
    // Sync every 2 seconds for real-time updates
    this.syncInterval = setInterval(() => {
      this.syncWithOtherDevices();
    }, 2000);
  }

  private handleStorageChange(event: StorageEvent) {
    if (event.key === 'superdb_sync' && event.newValue) {
      try {
        const syncData = JSON.parse(event.newValue);
        if (syncData.timestamp > this.lastSyncTime) {
          this.loadFromSyncData(syncData);
          this.lastSyncTime = syncData.timestamp;
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    }
  }

  private syncWithOtherDevices() {
    try {
      const syncData = localStorage.getItem('superdb_sync');
      if (syncData) {
        const parsed = JSON.parse(syncData);
        if (parsed.timestamp > this.lastSyncTime) {
          this.loadFromSyncData(parsed);
          this.lastSyncTime = parsed.timestamp;
        }
      }
    } catch (error) {
      console.error('Error syncing with other devices:', error);
    }
  }

  private loadFromSyncData(syncData: any) {
    if (syncData.data) {
      const { users, orders, specialOffers, coupons, plans } = syncData.data;
      
      if (users) this.users = new Map(users);
      if (orders) this.orders = new Map(orders);
      if (specialOffers) this.specialOffers = new Map(specialOffers);
      if (coupons) this.coupons = new Map(coupons);
      if (plans) this.plans = new Map(plans);
    }
  }

  private broadcastUpdate() {
    const syncData = {
      timestamp: Date.now(),
      data: {
        users: [...this.users],
        orders: [...this.orders],
        specialOffers: [...this.specialOffers],
        coupons: [...this.coupons],
        plans: [...this.plans]
      }
    };
    
    localStorage.setItem('superdb_sync', JSON.stringify(syncData));
    this.lastSyncTime = syncData.timestamp;
  }

  private loadFromStorage() {
    try {
      // Try to load from sync data first
      const syncData = localStorage.getItem('superdb_sync');
      if (syncData) {
        const parsed = JSON.parse(syncData);
        this.loadFromSyncData(parsed);
        this.lastSyncTime = parsed.timestamp;
        return;
      }

      // Fallback to individual storage items
      const usersData = localStorage.getItem('superdb_users');
      const ordersData = localStorage.getItem('superdb_orders');
      const offersData = localStorage.getItem('superdb_offers');
      const couponsData = localStorage.getItem('superdb_coupons');
      const plansData = localStorage.getItem('superdb_plans');

      if (usersData) {
        const users = JSON.parse(usersData);
        this.users = new Map(users);
      }

      if (ordersData) {
        const orders = JSON.parse(ordersData);
        this.orders = new Map(orders);
      }

      if (offersData) {
        const offers = JSON.parse(offersData);
        this.specialOffers = new Map(offers);
      }

      if (couponsData) {
        const coupons = JSON.parse(couponsData);
        this.coupons = new Map(coupons);
      }

      if (plansData) {
        const plans = JSON.parse(plansData);
        this.plans = new Map(plans);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      // Save to individual storage items (backward compatibility)
      localStorage.setItem('superdb_users', JSON.stringify([...this.users]));
      localStorage.setItem('superdb_orders', JSON.stringify([...this.orders]));
      localStorage.setItem('superdb_offers', JSON.stringify([...this.specialOffers]));
      localStorage.setItem('superdb_coupons', JSON.stringify([...this.coupons]));
      localStorage.setItem('superdb_plans', JSON.stringify([...this.plans]));
      
      // Broadcast update for cross-device sync
      this.broadcastUpdate();
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  private getDeviceInfo(): string {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(userAgent);
    
    if (isMobile && !isTablet) return 'Mobile';
    if (isTablet) return 'Tablet';
    return 'Desktop';
  }

  private initializeDefaultPlans() {
    if (this.plans.size === 0) {
      const defaultPlans = [
        { id: 'mc-budget-dirt', type: 'minecraft', category: 'budget', name: 'Dirt Plan', price: '₹49/mo', specs: { ram: '2GB', cpu: '100% CPU', storage: '5GB SSD' }, isActive: true },
        { id: 'mc-budget-wood', type: 'minecraft', category: 'budget', name: 'Wood Plan', price: '₹99/mo', specs: { ram: '4GB', cpu: '150% CPU', storage: '10GB SSD' }, isActive: true },
        { id: 'mc-budget-stone', type: 'minecraft', category: 'budget', name: 'Stone Plan', price: '₹159/mo', specs: { ram: '6GB', cpu: '200% CPU', storage: '15GB SSD' }, isActive: true },
        { id: 'vps-cheap-stone', type: 'vps', category: 'cheap', name: 'Stone Plan', price: '₹270/mo', specs: { ram: '2GB', cpu: '1 vCPU', storage: '20GB SSD' }, isActive: true },
        { id: 'vps-cheap-iron', type: 'vps', category: 'cheap', name: 'Iron Plan', price: '₹455/mo', specs: { ram: '4GB', cpu: '2 vCPU', storage: '40GB SSD' }, isActive: true },
        { id: 'domain-com', type: 'domain', category: 'popular', name: '.com', price: '₹999/year', specs: { tld: '.com' }, isActive: true },
        { id: 'domain-in', type: 'domain', category: 'popular', name: '.in', price: '₹699/year', specs: { tld: '.in' }, isActive: true },
      ];

      defaultPlans.forEach(plan => {
        this.plans.set(plan.id, plan as Plan);
      });
      this.saveToStorage();
    }
  }

  private initializeDefaultOffers() {
    if (this.specialOffers.size === 0) {
      const defaultOffers = [
        {
          id: 'offer-1',
          type: 'minecraft' as const,
          planName: 'Wood Plan',
          originalPrice: '₹99',
          discountPrice: '₹79',
          discountPercentage: 20,
          isActive: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 'offer-2',
          type: 'vps' as const,
          planName: 'Stone Plan',
          originalPrice: '₹270',
          discountPrice: '₹199',
          discountPercentage: 26,
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ];

      defaultOffers.forEach(offer => {
        this.specialOffers.set(offer.id, offer);
      });
      this.saveToStorage();
    }
  }

  // User Management
  createUser(discordUser: any): User {
    const user: User = {
      id: this.generateId(),
      discordId: discordUser.id,
      username: discordUser.global_name || discordUser.username,
      email: discordUser.email,
      membershipType: 'normal',
      purchases: [],
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      deviceInfo: this.getDeviceInfo()
    };

    this.users.set(user.id, user);
    this.saveToStorage();
    return user;
  }

  getUserByDiscordId(discordId: string): User | null {
    for (const user of this.users.values()) {
      if (user.discordId === discordId) {
        // Update last seen
        user.lastSeen = new Date().toISOString();
        user.deviceInfo = this.getDeviceInfo();
        this.users.set(user.id, user);
        this.saveToStorage();
        return user;
      }
    }
    return null;
  }

  updateUserMembership(userId: string, membershipType: 'normal' | 'premium'): boolean {
    const user = this.users.get(userId);
    if (user) {
      user.membershipType = membershipType;
      this.users.set(userId, user);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).sort((a, b) => 
      new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
    );
  }

  // Order Management
  createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'deviceInfo'>): Order {
    const order: Order = {
      ...orderData,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      deviceInfo: this.getDeviceInfo()
    };

    this.orders.set(order.id, order);
    this.saveToStorage();
    return order;
  }

  confirmOrder(orderId: string): boolean {
    const order = Array.from(this.orders.values()).find(o => o.orderId === orderId);
    if (order) {
      order.status = 'confirmed';
      this.orders.set(order.id, order);

      const user = this.users.get(order.userId);
      if (user) {
        const purchase: Purchase = {
          id: this.generateId(),
          type: order.type,
          planName: order.planName,
          price: order.price,
          status: 'confirmed',
          purchaseDate: new Date().toISOString(),
          renewalDate: this.calculateRenewalDate(order.type),
          orderId: order.orderId
        };
        user.purchases.push(purchase);
        this.users.set(user.id, user);
      }

      this.saveToStorage();
      return true;
    }
    return false;
  }

  resetOrder(orderId: string): boolean {
    const order = Array.from(this.orders.values()).find(o => o.orderId === orderId || o.id === orderId);
    if (order) {
      order.status = 'pending';
      this.orders.set(order.id, order);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deleteOrder(orderId: string): boolean {
    const order = Array.from(this.orders.values()).find(o => o.orderId === orderId || o.id === orderId);
    if (!order) return false;
    
    const deleted = this.orders.delete(order.id);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // Special Offers Management
  createSpecialOffer(offerData: Omit<SpecialOffer, 'id' | 'createdAt'>): SpecialOffer {
    const offer: SpecialOffer = {
      ...offerData,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };

    this.specialOffers.set(offer.id, offer);
    this.saveToStorage();
    return offer;
  }

  deleteSpecialOffer(offerId: string): boolean {
    const deleted = this.specialOffers.delete(offerId);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  getActiveSpecialOffers(): SpecialOffer[] {
    return Array.from(this.specialOffers.values()).filter(offer => offer.isActive);
  }

  toggleSpecialOffer(offerId: string): boolean {
    const offer = this.specialOffers.get(offerId);
    if (offer) {
      offer.isActive = !offer.isActive;
      this.specialOffers.set(offerId, offer);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllSpecialOffers(): SpecialOffer[] {
    return Array.from(this.specialOffers.values());
  }

  // Coupon Management
  createCoupon(couponData: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>): Coupon {
    const coupon: Coupon = {
      ...couponData,
      id: this.generateId(),
      usedCount: 0,
      createdAt: new Date().toISOString()
    };

    this.coupons.set(coupon.id, coupon);
    this.saveToStorage();
    return coupon;
  }

  deleteCoupon(couponId: string): boolean {
    const deleted = this.coupons.delete(couponId);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  resetCoupon(couponId: string): boolean {
    const coupon = this.coupons.get(couponId);
    if (coupon) {
      coupon.usedCount = 0;
      this.coupons.set(couponId, coupon);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  toggleCoupon(couponId: string): boolean {
    const coupon = this.coupons.get(couponId);
    if (coupon) {
      coupon.isActive = !coupon.isActive;
      this.coupons.set(couponId, coupon);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  validateCoupon(code: string): Coupon | null {
    for (const coupon of this.coupons.values()) {
      if (coupon.code === code && coupon.isActive && 
          coupon.usedCount < coupon.usageLimit &&
          new Date(coupon.expiryDate) > new Date()) {
        return coupon;
      }
    }
    return null;
  }

  useCoupon(code: string): boolean {
    const coupon = this.validateCoupon(code);
    if (coupon) {
      coupon.usedCount++;
      this.coupons.set(coupon.id, coupon);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getAllCoupons(): Coupon[] {
    return Array.from(this.coupons.values());
  }

  // Plan Management
  createPlan(planData: Omit<Plan, 'id'>): Plan {
    const plan: Plan = {
      ...planData,
      id: this.generateId()
    };

    this.plans.set(plan.id, plan);
    this.saveToStorage();
    return plan;
  }

  updatePlan(planId: string, updates: Partial<Plan>): boolean {
    const plan = this.plans.get(planId);
    if (plan) {
      Object.assign(plan, updates);
      this.plans.set(planId, plan);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  deletePlan(planId: string): boolean {
    const deleted = this.plans.delete(planId);
    if (deleted) {
      this.saveToStorage();
    }
    return deleted;
  }

  getAllPlans(): Plan[] {
    return Array.from(this.plans.values());
  }

  // Utility Methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private calculateRenewalDate(type: string): string {
    const now = new Date();
    if (type === 'domain') {
      now.setFullYear(now.getFullYear() + 1);
    } else {
      now.setMonth(now.getMonth() + 1);
    }
    return now.toISOString();
  }

  // Analytics
  getAnalytics() {
    const totalUsers = this.users.size;
    const premiumUsers = Array.from(this.users.values()).filter(u => u.membershipType === 'premium').length;
    const totalOrders = this.orders.size;
    const confirmedOrders = Array.from(this.orders.values()).filter(o => o.status === 'confirmed').length;
    const pendingOrders = Array.from(this.orders.values()).filter(o => o.status === 'pending').length;
    const activeCoupons = Array.from(this.coupons.values()).filter(c => c.isActive).length;
    const activeOffers = Array.from(this.specialOffers.values()).filter(o => o.isActive).length;

    // Device analytics
    const deviceStats = Array.from(this.users.values()).reduce((acc, user) => {
      const device = user.deviceInfo || 'Unknown';
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers,
      premiumUsers,
      normalUsers: totalUsers - premiumUsers,
      totalOrders,
      confirmedOrders,
      pendingOrders,
      activeCoupons,
      activeOffers,
      deviceStats
    };
  }

  // Force refresh from other devices
  forceSync(): void {
    this.syncWithOtherDevices();
  }

  // Cleanup
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
  }
}

export const superDatabase = SuperDatabase.getInstance();
export type { User, Order, SpecialOffer, Coupon, Plan, Purchase };

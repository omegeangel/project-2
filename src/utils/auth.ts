interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  email: string;
  verified: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: DiscordUser | null;
  token: string | null;
}

class AuthManager {
  private static instance: AuthManager;
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };
  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  constructor() {
    this.loadFromStorage();
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
    };
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('auth_state');
      if (stored) {
        this.authState = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load auth state from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('auth_state', JSON.stringify(this.authState));
    } catch (error) {
      console.error('Failed to save auth state to storage:', error);
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  setAuth(user: DiscordUser, token: string) {
    this.authState = {
      isAuthenticated: true,
      user,
      token
    };
    this.saveToStorage();
    this.notifyListeners();
  }

  clearAuth() {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    this.saveToStorage();
    this.notifyListeners();
  }

  getAuthState(): AuthState {
    return { ...this.authState };
  }

  getAvatarUrl(): string | null {
    if (!this.authState.user?.avatar) return null;
    return `https://cdn.discordapp.com/avatars/${this.authState.user.id}/${this.authState.user.avatar}.png`;
  }

  getDiscordUsername(): string {
    if (!this.authState.user) return '';
    return this.authState.user.global_name || this.authState.user.username;
  }

  getFirstName(): string {
    const fullName = this.getDiscordUsername();
    return fullName.split(' ')[0] || '';
  }

  getLastName(): string {
    const fullName = this.getDiscordUsername();
    const parts = fullName.split(' ');
    return parts.length > 1 ? parts.slice(1).join(' ') : '';
  }

  getEmail(): string {
    return this.authState.user?.email || '';
  }
}

export const authManager = AuthManager.getInstance();
export type { AuthState, DiscordUser };
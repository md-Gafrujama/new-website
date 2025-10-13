export const adminAuth = {
  // Storage keys
  TOKEN_KEY: process.env.NEXT_PUBLIC_ADMIN_TOKEN_KEY || 'adminToken',
  DATA_KEY: process.env.NEXT_PUBLIC_ADMIN_DATA_KEY || 'adminData',

  // Save auth data
  saveAuthData(token, adminData) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.DATA_KEY, JSON.stringify(adminData));
    }
  },

  // Get token
  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  },

  // Get admin data
  getAdminData() {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(this.DATA_KEY);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error('Error parsing admin data:', error);
        return null;
      }
    }
    return null;
  },

  // Check if authenticated
  isAuthenticated() {
    return !!this.getToken();
  },

  // Clear auth data
  clearAuthData() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.DATA_KEY);
    }
  },

  // Check token expiration (basic check)
  isTokenExpired() {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  },
};

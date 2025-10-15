const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class AdminAPI {
  // Helper method for making requests
  async makeRequest(endpoint, options = {}) {
    try {
      const token = typeof window !== 'undefined' ? 
        localStorage.getItem(process.env.NEXT_PUBLIC_ADMIN_TOKEN_KEY || 'adminToken') : null;

      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return {
        success: true,
        data,
        status: response.status,
      };
    } catch (error) {
      console.error('API Request Error:', error);
      return {
        success: false,
        error: error.message,
        status: error.status || 500,
      };
    }
  }

  // Health Check
  async healthCheck() {
    return this.makeRequest('/');
  }

  // Auth Health Check
  async authHealthCheck() {
    return this.makeRequest('/api/auth/health');
  }

  // Test Email Configuration
  async testEmail() {
    return this.makeRequest('/api/auth/test-email');
  }

  // Send OTP
  async sendOTP(email) {
    return this.makeRequest('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Verify OTP and Login
  async verifyOTP(email, otp) {
    return this.makeRequest('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // Resend OTP
  async resendOTP(email) {
    return this.makeRequest('/api/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  // Alternative Login (Password + 2FA)
  async loginWithPassword(email, password) {
    return this.makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Get Admin Profile (Protected)
  async getProfile() {
    return this.makeRequest('/api/auth/profile');
  }

  // Change Password (Protected)
  async changePassword(currentPassword, newPassword) {
    return this.makeRequest('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Toggle 2FA (Protected)
  async toggle2FA(enabled) {
    return this.makeRequest('/api/auth/toggle-2fa', {
      method: 'POST',
      body: JSON.stringify({ enabled }),
    });
  }

  // Logout (Protected)
  async logout() {
    return this.makeRequest('/api/auth/logout', {
      method: 'POST',
    });
  }

  // Get Website Requests
  async getWebsiteRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/website-requests?${queryString}`);
  }

  // Get Mobile App Requests
  async getMobileAppRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/mobile-app-requests?${queryString}`);
  }

  // Get Cloud Hosting Requests
  async getCloudHostingRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/cloud-hosting-requests?${queryString}`);
  }

  // Get CRM Solution Requests
  async getCrmSolutionRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/crm-solution-requests?${queryString}`);
  }

  // Get HRMS Solution Requests
  async getHrmsSolutionRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/hrms-solution-requests?${queryString}`);
  }

  // Get AI Content Requests
  async getAiContentRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/ai-content-requests?${queryString}`);
  }
}

export default new AdminAPI();

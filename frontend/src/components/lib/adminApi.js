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
      let data = null;
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!response.ok) {
        const errorMessage =
          (data && (data.message || data.error)) ||
          response.statusText ||
          `Request failed (${response.status})`;
        const safeMessage = String(errorMessage).trim() || 'Something went wrong. Please try again.';
        if (process.env.NODE_ENV === 'development') {
          console.warn(`API ${response.status} ${endpoint}:`, safeMessage, data?.message ? '' : '(no server message)');
        }
        throw new Error(safeMessage);
      }

      if (data && data.success === false) {
        const msg = data.message || data.error || 'Request failed';
        throw new Error(typeof msg === 'string' ? msg : 'Request failed');
      }

      return {
        success: true,
        data: data || {},
        status: response.status,
      };
    } catch (error) {
      let message =
        (error && typeof error.message === 'string' && error.message.trim()) ||
        'Network or server error. Please try again.';
      if (message === 'Failed to fetch' || error?.message === 'Failed to fetch') {
        message = 'Backend server is not running. Start it from the backend folder (e.g. npm run dev or nodemon).';
      }
      if (process.env.NODE_ENV === 'development') {
        console.warn('API Request Error:', message);
      }
      return {
        success: false,
        error: message,
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

  // Get Digital Marketing Requests
  async getDigitalMarketingRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/digital-marketing-requests?${queryString}`);
  }

  // Get LMS Requests
  async getLmsRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/lms-requests?${queryString}`);
  }

  // Get Branding Design Requests
  async getBrandingDesignRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/branding-design-requests?${queryString}`);
  }

  // Get Ecommerce Requests
  async getEcommerceRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/ecommerce-project-requests?${queryString}`);
  }

  // Get SaaS Product Requests
  async getSaasProductRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/saas-product-requests?${queryString}`);
  }

  // Get Healthcare Requests
  async getHealthcareRequests(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/healthcare-requests?${queryString}`);
  }

  // Submit Digital Marketing Request
  async submitDigitalMarketingRequest(data) {
    return this.makeRequest('/api/digital-marketing-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Update Status Methods
  async updateWebsiteRequestStatus(id, status) {
    return this.makeRequest(`/api/website-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateMobileAppRequestStatus(id, status) {
    return this.makeRequest(`/api/mobile-app-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateCloudHostingRequestStatus(id, status) {
    return this.makeRequest(`/api/cloud-hosting-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateCrmSolutionRequestStatus(id, status) {
    return this.makeRequest(`/api/crm-solution-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateHrmsSolutionRequestStatus(id, status) {
    return this.makeRequest(`/api/hrms-solution-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateAiContentRequestStatus(id, status) {
    return this.makeRequest(`/api/ai-content-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateDigitalMarketingRequestStatus(id, status) {
    return this.makeRequest(`/api/digital-marketing-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateLmsRequestStatus(id, status) {
    return this.makeRequest(`/api/lms-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateEcommerceRequestStatus(id, status) {
    return this.makeRequest(`/api/ecommerce-project-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateBrandingDesignRequestStatus(id, status) {
    return this.makeRequest(`/api/branding-design-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateSaasProductRequestStatus(id, status) {
    return this.makeRequest(`/api/saas-product-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  async updateHealthcareRequestStatus(id, status) {
    return this.makeRequest(`/api/healthcare-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }

  // Delete Methods
  async deleteWebsiteRequest(id) {
    return this.makeRequest(`/api/website-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteMobileAppRequest(id) {
    return this.makeRequest(`/api/mobile-app-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteCloudHostingRequest(id) {
    return this.makeRequest(`/api/cloud-hosting-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteCrmSolutionRequest(id) {
    return this.makeRequest(`/api/crm-solution-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteHrmsSolutionRequest(id) {
    return this.makeRequest(`/api/hrms-solution-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteAiContentRequest(id) {
    return this.makeRequest(`/api/ai-content-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteDigitalMarketingRequest(id) {
    return this.makeRequest(`/api/digital-marketing-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteLmsRequest(id) {
    return this.makeRequest(`/api/lms-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteEcommerceRequest(id) {
    return this.makeRequest(`/api/ecommerce-project-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteBrandingDesignRequest(id) {
    return this.makeRequest(`/api/branding-design-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteSaasProductRequest(id) {
    return this.makeRequest(`/api/saas-product-requests/${id}`, {
      method: 'DELETE',
    });
  }

  async deleteHealthcareRequest(id) {
    return this.makeRequest(`/api/healthcare-requests/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment API Methods
  async createPayment(paymentData) {
    return this.makeRequest('/api/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  async getAllPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.makeRequest(`/api/payments${queryString ? `?${queryString}` : ''}`);
  }

  async getPaymentById(id) {
    return this.makeRequest(`/api/payments/${id}`);
  }

  async updatePayment(id, paymentData) {
    return this.makeRequest(`/api/payments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(paymentData),
    });
  }

  async deletePayment(id) {
    return this.makeRequest(`/api/payments/${id}`, {
      method: 'DELETE',
    });
  }

  async getRevenueStats() {
    return this.makeRequest('/api/payments/stats');
  }

  async getPaymentsByProject(projectId, projectType) {
    return this.makeRequest(`/api/payments/project?projectId=${projectId}&projectType=${projectType}`);
  }
}

export default new AdminAPI();

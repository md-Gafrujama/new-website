"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import adminAPI from '../components/lib/adminApi';
import { adminAuth } from '../components/lib/adminAuth';

const AdminAuthContext = createContext({});

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (!adminAuth.isAuthenticated() || adminAuth.isTokenExpired()) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const result = await adminAPI.getProfile();
      
      if (result.success) {
        setIsAuthenticated(true);
        setAdmin(result.data.data.admin);
      } else {
        adminAuth.clearAuthData();
        setIsAuthenticated(false);
        setAdmin(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      adminAuth.clearAuthData();
      setIsAuthenticated(false);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, otp) => {
    try {
      const result = await adminAPI.verifyOTP(email, otp);
      
      if (result.success) {
        const { token, admin: adminData } = result.data.data;
        
        // Save auth data
        adminAuth.saveAuthData(token, adminData);
        
        // Update state
        setIsAuthenticated(true);
        setAdmin(adminData);
        
        return { success: true, message: result.data.message };
      }
      
      return { success: false, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      // Call backend logout
      await adminAPI.logout();
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // Clear local data
      adminAuth.clearAuthData();
      setIsAuthenticated(false);
      setAdmin(null);
    }
  };

  const value = {
    isAuthenticated,
    admin,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

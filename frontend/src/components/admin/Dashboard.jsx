"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminAPI from '../lib/adminApi';

const Dashboard = () => {
  const { admin, logout } = useAdminAuth();
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const result = await adminAPI.getProfile();
      
      if (result.success) {
        setAdminProfile(result.data.data.admin);
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      setError('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force redirect even if logout fails
      router.push('/admin/login');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {adminProfile?.firstName || 'Admin'}! 🎉
              </h1>
              <p className="text-gray-600 mt-1">
                You have successfully logged into the admin dashboard
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {adminProfile?.firstName} {adminProfile?.lastName}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {adminProfile?.role} Account
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Welcome Message */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center">
              <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center mr-6">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  🎉 Login Successful!
                </h2>
                <p className="text-emerald-100 text-lg">
                  Welcome to your admin dashboard. You are now securely authenticated.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Your Profile Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium text-gray-900">
                  {adminProfile?.firstName} {adminProfile?.lastName}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium text-gray-900">
                  {adminProfile?.email}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium text-gray-900 capitalize">
                  {adminProfile?.role}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Account Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  adminProfile?.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {adminProfile?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">2FA Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  adminProfile?.twoFactorEnabled 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {adminProfile?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          {/* Session Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Session Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Login Time:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(new Date())}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Login:</span>
                <span className="font-medium text-gray-900">
                  {adminProfile?.lastLogin ? formatDate(adminProfile.lastLogin) : 'First time'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Member Since:</span>
                <span className="font-medium text-gray-900">
                  {adminProfile?.createdAt ? formatDate(adminProfile.createdAt) : 'Unknown'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Session Status:</span>
                <span className="inline-flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-2"></span>
                  <span className="text-green-600 font-medium">Active</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            System Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="h-8 w-8 mx-auto mb-2 text-green-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-900">Authentication</p>
              <p className="text-xs text-green-600">Secure</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="h-8 w-8 mx-auto mb-2 text-blue-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7c0-2.21-3.582-4-8-4s-8 1.79-8 4z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-blue-900">Database</p>
              <p className="text-xs text-blue-600">Connected</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="h-8 w-8 mx-auto mb-2 text-purple-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-purple-900">Email Service</p>
              <p className="text-xs text-purple-600">Active</p>
            </div>
            <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="h-8 w-8 mx-auto mb-2 text-emerald-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-emerald-900">Security</p>
              <p className="text-xs text-emerald-600">Protected</p>
            </div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Visit Main Website
          </a>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

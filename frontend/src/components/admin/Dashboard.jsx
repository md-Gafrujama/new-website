"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../context/AdminAuthContext';
import adminAPI from '../lib/adminApi';
import {
  ChartBarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ServerIcon,
  EnvelopeIcon,
  UserIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { admin, logout } = useAdminAuth();
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leadStats, setLeadStats] = useState({
    total: 0,
    pending: 0,
    reviewed: 0,
    inProgress: 0,
    completed: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAdminProfile();
    fetchLeadStats();
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

  const fetchLeadStats = async () => {
    setLoadingStats(true);
    try {
      const results = await Promise.allSettled([
        adminAPI.getWebsiteRequests({ limit: 10000 }),
        adminAPI.getMobileAppRequests({ limit: 10000 }),
        adminAPI.getCloudHostingRequests({ limit: 10000 }),
        adminAPI.getCrmSolutionRequests({ limit: 10000 }),
        adminAPI.getHrmsSolutionRequests({ limit: 10000 }),
        adminAPI.getAiContentRequests({ limit: 10000 }),
        adminAPI.getDigitalMarketingRequests({ limit: 10000 }),
        adminAPI.getLmsRequests({ limit: 10000 }),
        adminAPI.getEcommerceRequests({ limit: 10000 }),
        adminAPI.getBrandingDesignRequests({ limit: 10000 }),
        adminAPI.getSaasProductRequests({ limit: 10000 }),
        adminAPI.getHealthcareRequests({ limit: 10000 })
      ]);

      let total = 0, pending = 0, reviewed = 0, inProgress = 0, completed = 0;

      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value.success) {
          const requests = result.value.data?.data?.requests || [];
          total += requests.length;
          pending += requests.filter(r => r.status === 'pending').length;
          reviewed += requests.filter(r => r.status === 'reviewed').length;
          inProgress += requests.filter(r => r.status === 'in-progress').length;
          completed += requests.filter(r => r.status === 'completed').length;
        }
      });

      setLeadStats({ total, pending, reviewed, inProgress, completed });
    } catch (error) {
      console.error('Error fetching lead stats:', error);
    } finally {
      setLoadingStats(false);
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

  // Enhanced Interactive Bar Chart Component
  const BarChart = ({ data, maxValue }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const maxHeight = 250;
    const totalLeads = data.total;
    
    const getBarHeight = (value) => {
      if (maxValue === 0) return 0;
      return (value / maxValue) * maxHeight;
    };

    const getPercentage = (value) => {
      if (totalLeads === 0) return 0;
      return ((value / totalLeads) * 100).toFixed(1);
    };

    const bars = [
      { 
        label: 'Total', 
        value: data.total, 
        color: 'from-blue-500 via-blue-600 to-indigo-600',
        shadowColor: 'shadow-blue-500/50',
        icon: ChartBarIcon
      },
      { 
        label: 'Pending', 
        value: data.pending, 
        color: 'from-amber-500 via-yellow-500 to-orange-500',
        shadowColor: 'shadow-amber-500/50',
        icon: ClockIcon
      },
      { 
        label: 'Reviewed', 
        value: data.reviewed, 
        color: 'from-cyan-500 via-blue-500 to-indigo-500',
        shadowColor: 'shadow-cyan-500/50',
        icon: CheckCircleIcon
      },
      { 
        label: 'In Progress', 
        value: data.inProgress, 
        color: 'from-orange-500 via-red-500 to-pink-500',
        shadowColor: 'shadow-orange-500/50',
        icon: ArrowPathIcon
      },
      { 
        label: 'Completed', 
        value: data.completed, 
        color: 'from-emerald-500 via-green-500 to-teal-500',
        shadowColor: 'shadow-emerald-500/50',
        icon: CheckCircleIcon
      },
    ];

    // Grid lines for reference
    const gridLines = [0, 0.25, 0.5, 0.75, 1];

    return (
      <div className="w-full relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-[250px] flex flex-col justify-between pr-2 -ml-12">
          {gridLines.map((ratio, idx) => {
            const value = Math.round(maxValue * ratio);
            return (
              <div key={idx} className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {value}
              </div>
            );
          })}
        </div>

        {/* Chart Container */}
        <div className="relative pl-8">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between h-[250px] pointer-events-none">
            {gridLines.map((ratio, idx) => (
              <div
                key={idx}
                className="w-full border-t border-dashed border-gray-300 dark:border-gray-600"
                style={{ opacity: idx === 0 ? 0 : 0.3 }}
              />
            ))}
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between h-[250px] gap-4 px-2 relative z-10">
            {bars.map((bar, index) => {
              const height = getBarHeight(bar.value);
              const percentage = getPercentage(bar.value);
              const isHovered = hoveredIndex === index;
              const Icon = bar.icon;
              
              return (
                <div 
                  key={index} 
                  className="flex-1 flex flex-col items-center group relative"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  <div className={`absolute -top-16 left-1/2 transform -translate-x-1/2 z-20 transition-all duration-300 ${
                    isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}>
                    <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-2xl whitespace-nowrap border border-gray-700">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{bar.label}</span>
                      </div>
                      <div className="text-center mt-1 text-lg">{bar.value} leads</div>
                      <div className="text-xs text-gray-300 text-center mt-1">{percentage}% of total</div>
                      {/* Arrow */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>

                  {/* Bar Container */}
                  <div className="relative w-full flex flex-col items-center justify-end h-[250px]">
                    {/* Animated Bar */}
                    <div
                      className={`relative w-full bg-gradient-to-t ${bar.color} rounded-t-xl transition-all duration-700 ease-out cursor-pointer overflow-hidden ${
                        isHovered 
                          ? `shadow-2xl ${bar.shadowColor} scale-105` 
                          : 'shadow-lg hover:shadow-xl hover:scale-[1.02]'
                      }`}
                      style={{ 
                        height: `${height}px`, 
                        minHeight: height > 0 ? '8px' : '0',
                        animation: `barGrow 0.8s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Value badge on bar */}
                      {height > 30 && (
                        <div className={`absolute top-2 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                          isHovered ? 'opacity-100 scale-110' : 'opacity-70 scale-100'
                        }`}>
                          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-lg shadow-md">
                            {bar.value}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Percentage indicator */}
                    {height > 0 && (
                      <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
                        isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                      }`}>
                        <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                          {percentage}%
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Label Section */}
                  <div className="mt-8 text-center w-full">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Icon className={`h-5 w-5 transition-colors duration-300 ${
                        isHovered 
                          ? 'text-blue-600 dark:text-blue-400 scale-110' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`} />
                      <p className={`text-sm font-bold transition-colors duration-300 ${
                        isHovered 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {bar.label}
                      </p>
                    </div>
                    <p className={`text-2xl font-extrabold transition-all duration-300 ${
                      isHovered 
                        ? 'text-gray-900 dark:text-white scale-110' 
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {bar.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {percentage}% of total
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
            <SparklesIcon className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading dashboard...</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const maxChartValue = Math.max(
    leadStats.total,
    leadStats.pending,
    leadStats.reviewed,
    leadStats.inProgress,
    leadStats.completed
  ) || 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Admin</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">Dashboard</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Welcome, {adminProfile?.firstName || 'Admin'}! 🎉
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                You have successfully logged into the admin dashboard
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {adminProfile?.firstName} {adminProfile?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {adminProfile?.role} Account
                </p>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {adminProfile?.firstName?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Welcome Message */}
        <div className="mb-8">
          <div className="relative bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 rounded-2xl p-8 text-white shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-white/20 transition-all duration-500"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-20 w-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircleIcon className="h-10 w-10" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">
                    🎉 Login Successful!
                  </h2>
                  <p className="text-emerald-50 text-lg">
                    Welcome to your admin dashboard. You are now securely authenticated.
                  </p>
                </div>
              </div>
              <a
                href="/admin/dashboard/analytics"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 font-medium"
              >
                <ChartBarIcon className="h-5 w-5" />
                View Analytics
              </a>
            </div>
          </div>
        </div>


        {/* Enhanced Lead Statistics with Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Client Leads Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real-time statistics across all services</p>
            </div>
            <a
              href="/admin/client-leads"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
            >
              View All Leads
              <ArrowRightIcon className="h-5 w-5" />
            </a>
          </div>
          {loadingStats ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading statistics...</p>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                <div className="group relative bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <ChartBarIcon className="h-8 w-8 text-blue-200" />
                    </div>
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wide mb-1">Total Leads</p>
                    <p className="text-3xl font-bold">{leadStats.total}</p>
                  </div>
                </div>
                <div className="group relative bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <ClockIcon className="h-8 w-8 text-amber-200" />
                    </div>
                    <p className="text-amber-100 text-xs font-medium uppercase tracking-wide mb-1">Pending</p>
                    <p className="text-3xl font-bold">{leadStats.pending}</p>
                  </div>
                </div>
                <div className="group relative bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <CheckCircleIcon className="h-8 w-8 text-cyan-200" />
                    </div>
                    <p className="text-cyan-100 text-xs font-medium uppercase tracking-wide mb-1">Reviewed</p>
                    <p className="text-3xl font-bold">{leadStats.reviewed}</p>
                  </div>
                </div>
                <div className="group relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <ArrowPathIcon className="h-8 w-8 text-orange-200" />
                    </div>
                    <p className="text-orange-100 text-xs font-medium uppercase tracking-wide mb-1">In Progress</p>
                    <p className="text-3xl font-bold">{leadStats.inProgress}</p>
                  </div>
                </div>
                <div className="group relative bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 rounded-xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <CheckCircleIcon className="h-8 w-8 text-emerald-200" />
                    </div>
                    <p className="text-emerald-100 text-xs font-medium uppercase tracking-wide mb-1">Completed</p>
                    <p className="text-3xl font-bold">{leadStats.completed}</p>
                  </div>
                </div>
              </div>

              {/* Enhanced Interactive Bar Chart */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      Leads Distribution Chart
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Interactive visualization of lead statuses</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <ChartBarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Total: {leadStats.total}</span>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-inner">
                  <BarChart data={leadStats} maxValue={maxChartValue} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Enhanced System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
              <ServerIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              System Status
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="group text-center p-5 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="h-12 w-12 mx-auto mb-3 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="h-full w-full" />
              </div>
              <p className="text-sm font-bold text-green-900 dark:text-green-300 mb-1">Authentication</p>
              <p className="text-xs text-green-700 dark:text-green-400 font-medium">Secure</p>
            </div>
            <div className="group text-center p-5 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="h-12 w-12 mx-auto mb-3 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <ServerIcon className="h-full w-full" />
              </div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-1">Database</p>
              <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Connected</p>
            </div>
            <div className="group text-center p-5 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="h-12 w-12 mx-auto mb-3 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">
                <EnvelopeIcon className="h-full w-full" />
              </div>
              <p className="text-sm font-bold text-purple-900 dark:text-purple-300 mb-1">Email Service</p>
              <p className="text-xs text-purple-700 dark:text-purple-400 font-medium">Active</p>
            </div>
            <div className="group text-center p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <div className="h-12 w-12 mx-auto mb-3 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <ShieldCheckIcon className="h-full w-full" />
              </div>
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-300 mb-1">Security</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Protected</p>
            </div>
          </div>
        </div>

        {/* Back to Main Site */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Visit Main Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

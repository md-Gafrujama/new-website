"use client";

import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/context/AdminAuthContext';
import adminAPI from '@/components/lib/adminApi';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  PresentationChartLineIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const Analytics = () => {
  const { admin } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState({
    leadsByService: {},
    leadsByStatus: {},
    leadsByMonth: [],
    conversionRate: 0,
    averageResponseTime: 0,
    totalRevenue: 0,
    revenueCurrency: 'USD',
    topServices: [],
    recentActivity: [],
  });
  const [timeRange, setTimeRange] = useState('all'); // all, month, week, today

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch all lead types and payments
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
        adminAPI.getHealthcareRequests({ limit: 10000 }),
        adminAPI.getAllPayments({ limit: 10000 }) // Fetch payments for revenue calculation
      ]);

      const serviceNames = [
        'Website',
        'Mobile Apps',
        'Cloud Hosting',
        'CRM Solutions',
        'HRMS Solutions',
        'AI Content',
        'Digital Marketing',
        'LMS',
        'E-commerce',
        'Branding Design',
        'SaaS Product',
        'Healthcare'
      ];

      let allRequests = [];
      const leadsByService = {};
      const leadsByStatus = {
        pending: 0,
        reviewed: 0,
        'in-progress': 0,
        completed: 0,
      };
      const leadsByMonth = {};
      let completedCount = 0;
      let totalCount = 0;

      results.forEach((result, index) => {
        if (result.status === 'fulfilled' && result.value.success) {
          const requests = result.value.data?.data?.requests || [];
          const serviceName = serviceNames[index];
          
          leadsByService[serviceName] = requests.length;
          allRequests = [...allRequests, ...requests.map(r => ({ ...r, service: serviceName }))];

          requests.forEach(request => {
            // Count by status
            const status = request.status || 'pending';
            leadsByStatus[status] = (leadsByStatus[status] || 0) + 1;

            // Count by month
            if (request.submittedAt || request.createdAt) {
              const date = new Date(request.submittedAt || request.createdAt);
              const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
              leadsByMonth[monthKey] = (leadsByMonth[monthKey] || 0) + 1;
            }

            if (status === 'completed') completedCount++;
            totalCount++;
          });
        }
      });

      // Calculate conversion rate
      const conversionRate = totalCount > 0 ? ((completedCount / totalCount) * 100).toFixed(1) : 0;

      // Get top services
      const topServices = Object.entries(leadsByService)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      // Get monthly data for chart
      const monthlyData = Object.entries(leadsByMonth)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([month, count]) => ({
          month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          count
        }));

      // Calculate average response time (mock for now, can be enhanced with actual timestamps)
      const averageResponseTime = 2.5; // hours

      // Calculate total revenue from completed payments
      let totalRevenue = 0;
      let revenueCurrency = 'USD'; // Default currency
      const paymentsResult = results[12]; // Payments are the 13th result (index 12)
      if (paymentsResult.status === 'fulfilled' && paymentsResult.value.success) {
        const payments = paymentsResult.value.data?.data?.payments || [];
        // Sum up amounts from completed payments only
        const completedPayments = payments.filter(payment => payment.paymentStatus === 'completed');
        if (completedPayments.length > 0) {
          totalRevenue = completedPayments.reduce((sum, payment) => {
            // Sum all completed payment amounts
            return sum + (payment.amount || 0);
          }, 0);
          // Get the most common currency (or default to USD)
          const currencies = completedPayments.map(p => p.currency || 'USD').filter(Boolean);
          revenueCurrency = currencies.length > 0 ? currencies[0] : 'USD';
        }
      }

      setAnalyticsData({
        leadsByService,
        leadsByStatus,
        leadsByMonth: monthlyData,
        conversionRate: parseFloat(conversionRate),
        averageResponseTime,
        totalRevenue,
        revenueCurrency, // Store currency for display
        topServices,
        recentActivity: allRequests
          .sort((a, b) => new Date(b.submittedAt || b.createdAt) - new Date(a.submittedAt || a.createdAt))
          .slice(0, 10),
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Line Chart Component
  const LineChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map(d => d.count));
    const chartHeight = 200;
    const chartWidth = data.length * 60;

    return (
      <div className="w-full overflow-x-auto">
        <div className="min-w-full" style={{ width: `${chartWidth}px` }}>
          <svg height={chartHeight + 40} className="w-full">
            {/* Grid lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <line
                key={ratio}
                x1="0"
                y1={chartHeight * ratio + 20}
                x2="100%"
                y2={chartHeight * ratio + 20}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="4"
              />
            ))}
            
            {/* Line path */}
            <polyline
              points={data.map((d, i) => {
                const x = (i / (data.length - 1 || 1)) * (chartWidth - 40) + 20;
                const y = chartHeight - (d.count / maxValue) * chartHeight + 20;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Data points */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1 || 1)) * (chartWidth - 40) + 20;
              const y = chartHeight - (d.count / maxValue) * chartHeight + 20;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="5"
                    fill="#3b82f6"
                    className="hover:r-7 transition-all cursor-pointer"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    className="text-xs font-semibold fill-gray-700 dark:fill-gray-300"
                  >
                    {d.count}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {data.map((d, i) => {
              const x = (i / (data.length - 1 || 1)) * (chartWidth - 40) + 20;
              return (
                <text
                  key={i}
                  x={x}
                  y={chartHeight + 35}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                >
                  {d.month}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  // Pie Chart Component
  const PieChart = ({ data }) => {
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);
    if (total === 0) return null;

    const colors = {
      pending: '#f59e0b',
      reviewed: '#06b6d4',
      'in-progress': '#f97316',
      completed: '#10b981',
    };

    let currentAngle = -90;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    return (
      <svg width="200" height="200" className="mx-auto">
        {Object.entries(data).map(([status, value], index) => {
          const percentage = (value / total) * 100;
          const angle = (value / total) * 360;
          const startAngle = currentAngle;
          const endAngle = currentAngle + angle;

          const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
          const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
          const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
          const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

          const largeArcFlag = angle > 180 ? 1 : 0;

          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ');

          currentAngle += angle;

          return (
            <g key={status}>
              <path
                d={pathData}
                fill={colors[status] || '#9ca3af'}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            </g>
          );
        })}
        
        {/* Center circle */}
        <circle cx={centerX} cy={centerY} r="50" fill="white" className="dark:fill-gray-800" />
        <text
          x={centerX}
          y={centerY - 5}
          textAnchor="middle"
          className="text-lg font-bold fill-gray-900 dark:fill-white"
        >
          {total}
        </text>
        <text
          x={centerX}
          y={centerY + 15}
          textAnchor="middle"
          className="text-xs fill-gray-600 dark:fill-gray-400"
        >
          Total
        </text>

        {/* Legend */}
        <g transform="translate(210, 20)">
          {Object.entries(data).map(([status, value], index) => (
            <g key={status} transform={`translate(0, ${index * 25})`}>
              <rect width="12" height="12" fill={colors[status] || '#9ca3af'} rx="2" />
              <text
                x="18"
                y="9"
                className="text-xs fill-gray-700 dark:fill-gray-300"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}: {value} ({((value / total) * 100).toFixed(1)}%)
              </text>
            </g>
          ))}
        </g>
      </svg>
    );
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
              <SparklesIcon className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Loading analytics...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Admin</span>
                <span>/</span>
                <span>Dashboard</span>
                <span>/</span>
                <span className="text-gray-900 dark:text-white font-medium">Analytics</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Comprehensive insights and performance metrics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              >
                <option value="all">All Time</option>
                <option value="month">Last Month</option>
                <option value="week">Last Week</option>
                <option value="today">Today</option>
              </select>
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium"
              >
                <ArrowPathIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <PresentationChartLineIcon className="h-6 w-6" />
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-blue-200" />
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Conversion Rate</p>
            <p className="text-3xl font-bold">{analyticsData.conversionRate}%</p>
            <p className="text-blue-200 text-xs mt-2">Leads to completed</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-emerald-200" />
            </div>
            <p className="text-emerald-100 text-sm font-medium mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">
              {analyticsData.revenueCurrency === 'USD' ? '$' : ''}
              {analyticsData.totalRevenue.toLocaleString('en-US', { 
                maximumFractionDigits: 2,
                minimumFractionDigits: 0 
              })}
              {analyticsData.revenueCurrency !== 'USD' ? ` ${analyticsData.revenueCurrency}` : ''}
            </p>
            <p className="text-emerald-200 text-xs mt-2">From completed payments</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <ClockIcon className="h-6 w-6" />
              </div>
              <ArrowTrendingDownIcon className="h-8 w-8 text-purple-200" />
            </div>
            <p className="text-purple-100 text-sm font-medium mb-1">Avg Response Time</p>
            <p className="text-3xl font-bold">{analyticsData.averageResponseTime}h</p>
            <p className="text-purple-200 text-xs mt-2">Average hours</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <ArrowTrendingUpIcon className="h-8 w-8 text-orange-200" />
            </div>
            <p className="text-orange-100 text-sm font-medium mb-1">Total Leads</p>
            <p className="text-3xl font-bold">
              {Object.values(analyticsData.leadsByStatus).reduce((a, b) => a + b, 0)}
            </p>
            <p className="text-orange-200 text-xs mt-2">Across all services</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Trends</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Lead generation over time</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
              <LineChart data={analyticsData.leadsByMonth} />
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Status Distribution</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Leads by status</p>
              </div>
              <PresentationChartLineIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex justify-center">
              <PieChart data={analyticsData.leadsByStatus} />
            </div>
          </div>
        </div>

        {/* Service Performance & Top Services */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Services */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Top Performing Services</h3>
            <div className="space-y-4">
              {analyticsData.topServices.map((service, index) => {
                const maxCount = analyticsData.topServices[0]?.count || 1;
                const percentage = (service.count / maxCount) * 100;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {index + 1}. {service.name}
                      </span>
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {service.count} leads
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Breakdown */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Service Breakdown</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {Object.entries(analyticsData.leadsByService)
                .sort(([, a], [, b]) => b - a)
                .map(([service, count], index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {service.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{service}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{count}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">leads</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
          <div className="space-y-3">
            {analyticsData.recentActivity.slice(0, 10).map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {activity.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {activity.fullName || 'Unknown'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.service} • {activity.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activity.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    activity.status === 'in-progress' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                    activity.status === 'reviewed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  }`}>
                    {activity.status || 'pending'}
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {activity.submittedAt || activity.createdAt
                      ? new Date(activity.submittedAt || activity.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
};

export default Analytics;


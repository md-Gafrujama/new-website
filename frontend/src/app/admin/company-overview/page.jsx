"use client";

import { useAdminAuth } from '@/context/AdminAuthContext';
import { BuildingOfficeIcon, UsersIcon, ChartBarIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const CompanyOverview = () => {
  const { admin } = useAdminAuth();

  const stats = [
    {
      name: 'Total Projects',
      value: '24',
      icon: ChartBarIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Active Clients',
      value: '12',
      icon: UsersIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Team Members',
      value: '8',
      icon: BuildingOfficeIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Global Reach',
      value: '15+',
      icon: GlobeAltIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Company Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
          Get insights into your company's performance and metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Company Information</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Company Name</label>
              <p className="text-gray-900 dark:text-white font-medium transition-colors duration-300">Quore B2B Marketing</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Industry</label>
              <p className="text-gray-900 dark:text-white transition-colors duration-300">Technology & Marketing</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Founded</label>
              <p className="text-gray-900 dark:text-white transition-colors duration-300">2020</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors duration-300">Location</label>
              <p className="text-gray-900 dark:text-white transition-colors duration-300">Global</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 transition-colors duration-300">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">New project initiated</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Client meeting scheduled</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg transition-colors duration-300">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">Team member added</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOverview;

"use client";

import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { useDarkMode } from '@/context/DarkModeContext';
import { 
  ArrowRightOnRectangleIcon, 
  Bars3Icon 
} from '@heroicons/react/24/outline';
import Image from 'next/image';

const AdminNavbar = ({ onMenuToggle }) => {
  const { admin, logout } = useAdminAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Hamburger Menu, Logo and Admin Title */}
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu Button (Mobile) */}
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src="/images/gs.png"
                  alt="Admin Logo"
                  width={32}
                  height={24}
                  className="rounded-lg shadow-sm dark:opacity-90"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  Welcome, {admin?.firstName || 'Admin'}
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Dark Mode Toggle and Logout Button */}
          <div className="flex items-center space-x-3">
            {/* Dark Mode Toggle Switch */}
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              role="switch"
              aria-checked={isDarkMode}
              aria-label="Toggle dark mode"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md"
              title={`Logout ${admin?.firstName || 'Admin'}`}
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;

"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      {/* Fixed Admin Navbar */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <AdminNavbar onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        
      </div>
      
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={setSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={setIsMobileMenuOpen}
      />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 pt-16 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Page Content */}
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <div className="p-4 lg:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

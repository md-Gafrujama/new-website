"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "@heroicons/react/24/solid";

const Sidebar = ({ isCollapsed, onToggleCollapse, isMobileOpen, onMobileToggle }) => {
  const [openDropdowns, setOpenDropdowns] = useState([]); // ✅ multiple open dropdowns
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMobileOpen) {
      onMobileToggle(false);
    }
  }, [pathname]);

  const handleToggleCollapse = () => {
    onToggleCollapse(!isCollapsed);
  };

  // ✅ Sidebar menu items
  const menuItems = [
    {
      label: "Dashboard",
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
      subItems: [
        { title: "Dashboard Overview", href: "/admin/dashboard" },
        { title: "Analytics", href: "/admin/dashboard/analytics" },
      ],
    },
    {
      label: "Company Overview",
      icon: BuildingOfficeIcon,
      iconSolid: BuildingOfficeIconSolid,
      subItems: [
        { title: "Company Overview", href: "/admin/company-overview" },
        { title: "Departments", href: "/admin/company-overview/departments" },
      ],
    },
    {
      label: "Client Leads",
      icon: BuildingOfficeIcon,
      iconSolid: BuildingOfficeIconSolid,
      subItems: [
        { title: "Leads", href: "/admin/client-leads" },
        { title: "Revenue", href: "/admin/revenue" },
      ],
    },
    {
      label: "Settings",
      icon: Cog6ToothIcon,
      iconSolid: Cog6ToothIconSolid,
      subItems: [
        { title: "Profile Settings", href: "/admin/settings" },
        { title: "Security", href: "/admin/settings/security" },
      ],
    },
  ];

  const isActive = (href) => pathname === href;

  // ✅ Toggle multiple dropdowns
  const toggleDropdown = (label) => {
    setOpenDropdowns((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 dark:bg-black/70 z-40 pt-16 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => onMobileToggle(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] 
          bg-white dark:bg-gray-900 
          border-r border-gray-200 dark:border-gray-800 
          shadow-lg z-50
          flex flex-col justify-between overflow-hidden
          transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-lg flex items-center justify-center shadow-md">
                <BuildingOfficeIconSolid className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                Admin Panel
              </h2>
            </div>
          )}
          {/* Collapse Button */}
          <button
            onClick={handleToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-200"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
          {/* Mobile Close Button */}
          <button
            onClick={() => onMobileToggle(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors duration-200"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-4 flex-1 overflow-y-auto transition-all duration-300">
          {menuItems.map((item) => {
            const isOpen = openDropdowns.includes(item.label);
            const Icon = isOpen ? item.iconSolid : item.icon;

            return (
              <div key={item.label}>
                {/* Label Button */}
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group
                    ${
                      isOpen
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  title={isCollapsed ? item.label : ""}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 transition-all duration-200 ${
                        isOpen 
                          ? "text-blue-700 dark:text-blue-300" 
                          : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                      } ${!isCollapsed && "group-hover:scale-110"}`}
                    />
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </div>

                  {!isCollapsed && (
                    <span>
                      {isOpen ? (
                        <ChevronUpIcon className="w-4 h-4 text-blue-700 dark:text-blue-300" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      )}
                    </span>
                  )}
                </button>

                {/* Dropdown Items */}
                {!isCollapsed && isOpen && (
                  <div className="ml-9 mt-2 space-y-1 transition-all duration-300 ease-in-out animate-fadeIn">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        onClick={() => onMobileToggle(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-all duration-150 ${
                          isActive(sub.href)
                            ? "bg-blue-600 dark:bg-blue-700 text-white shadow-md"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 transition-all duration-300">
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
                Admin Dashboard
              </p>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
        
        /* Custom Scrollbar */
        nav::-webkit-scrollbar {
          width: 6px;
        }
        nav::-webkit-scrollbar-track {
          background: transparent;
        }
        nav::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        nav::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        .dark nav::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .dark nav::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </>
  );
};

export default Sidebar;

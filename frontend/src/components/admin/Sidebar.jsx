"use client";

import { useState } from "react";
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
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
} from "@heroicons/react/24/solid";

const Sidebar = ({ isCollapsed, onToggleCollapse }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState([]); // ✅ multiple open dropdowns
  const pathname = usePathname();

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
        // { title: "", href: "/admin/company-overview/departments" },
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
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 left-4 z-[60] p-2 bg-[#0A2540] text-white rounded-lg shadow-lg hover:bg-[#0A2540]/90 transition-colors"
      >
        {isMobileOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 pt-16"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-lg z-50
          flex flex-col justify-between overflow-hidden
          transition-[width] duration-300 ease-in-out
          ${isCollapsed ? "w-16" : "w-64"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 transition-all duration-300">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 transition-all duration-300">
              <div className="w-8 h-8 bg-[#0A2540] rounded-lg flex items-center justify-center">
                <BuildingOfficeIconSolid className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
            </div>
          )}
          {/* Collapse Button */}
          <button
            onClick={handleToggleCollapse}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            )}
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
                        ? "bg-[#E5E7EB] text-black shadow-md"
                        : "text-gray-700 hover:bg-gray-100 hover:text-[#0A2540]"
                    }
                    ${isCollapsed ? "justify-center" : ""}
                  `}
                  title={isCollapsed ? item.label : ""}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen ? "text-black" : "text-gray-500 group-hover:text-[#0A2540]"
                      } ${!isCollapsed && "group-hover:scale-110"}`}
                    />
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </div>

                  {!isCollapsed && (
                    <span>
                      {isOpen ? (
                        <ChevronUpIcon className="w-4 h-4 text-black" />
                      ) : (
                        <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                      )}
                    </span>
                  )}
                </button>

                {/* Dropdown Items */}
                {!isCollapsed && isOpen && (
                  <div className="ml-9 mt-2 space-y-1 transition-all duration-300 ease-in-out">
                    {item.subItems.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
                          isActive(sub.href)
                            ? "bg-[#0A2540] text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-[#0A2540]"
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
          <div className="p-4 border-t border-gray-200 transition-all duration-300">
            <div className="p-3 bg-gradient-to-r from-[#0A2540]/10 to-[#0A2540]/5 rounded-xl border border-[#0A2540]/20">
              <p className="text-xs text-gray-600 text-center">Admin Dashboard </p>
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
      `}</style>
    </>
  );
};

export default Sidebar;

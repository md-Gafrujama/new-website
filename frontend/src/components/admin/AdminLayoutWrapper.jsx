"use client";

import { usePathname } from 'next/navigation';
import AdminLayout from './AdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { DarkModeProvider } from '@/context/DarkModeContext';

const AdminLayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  // const isLoginPage = pathname === '/admin/login';

  const isPublicRoute = pathname === '/admin/login' || pathname === '/admin/verify-otp';
if (isPublicRoute) {
  return children;
}

  // if (isLoginPage) {
  //   // Login page: no admin layout (sidebar/navbar), just the content
  //   return children;
  // }

  // Other admin pages: protect with authentication and use admin layout
  return (
    <DarkModeProvider>
      <ProtectedRoute>
        <AdminLayout>
          {children}
        </AdminLayout>
      </ProtectedRoute>
    </DarkModeProvider>
  );
};

export default AdminLayoutWrapper;

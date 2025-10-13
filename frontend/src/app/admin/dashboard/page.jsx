"use client";

import { AdminAuthProvider } from '../../../context/AdminAuthContext';
import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import Dashboard from '../../../components/admin/Dashboard';

export default function AdminDashboardPage() {
  return (
    <AdminAuthProvider>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </AdminAuthProvider>
  );
}

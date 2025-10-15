"use client";

import ProtectedRoute from '../../../components/admin/ProtectedRoute';
import Dashboard from '../../../components/admin/Dashboard';

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

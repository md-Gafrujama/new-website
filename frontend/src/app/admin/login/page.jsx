"use client";

import { AdminAuthProvider } from '../../../context/AdminAuthContext';
import LoginForm from '../../../components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <AdminAuthProvider>
      <LoginForm />
    </AdminAuthProvider>
  );
}

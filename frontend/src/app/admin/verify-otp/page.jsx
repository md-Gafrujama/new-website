"use client";

import { AdminAuthProvider } from '../../../context/AdminAuthContext';
import OTPVerificationForm from '../../../components/admin/OTPVerificationForm';

export default function AdminOTPPage() {
  return (
    <AdminAuthProvider>
      <OTPVerificationForm />
    </AdminAuthProvider>
  );
}

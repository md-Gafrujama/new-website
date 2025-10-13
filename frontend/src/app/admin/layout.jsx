import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper';

export const metadata = {
  title: 'Admin Panel - Quore B2B',
  description: 'Admin authentication and management',
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }) {
  return (
    <AdminLayoutWrapper>
      {children}
    </AdminLayoutWrapper>
  );
}
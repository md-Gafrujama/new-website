"use client";

import { usePathname } from 'next/navigation';
import LowNav from '@/components/lowNav';
import Footer from '@/components/Footer';

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isLoginPage = pathname === '/admin/login';

  if (isAdminRoute && !isLoginPage) {
    // Admin routes (except login): no main navbar/footer, full screen
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }

  // Regular routes: with navbar and footer
  return (
    <>
      <header>
        <LowNav />
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
    </>
  );
};

export default LayoutWrapper;


import './globals.css';
import { Quicksand } from 'next/font/google';

import LayoutWrapper from '@/components/LayoutWrapper';
import { AdminAuthProvider } from '@/context/AdminAuthContext';

export const metadata = {
  title: 'Quore B2B Marketing',
  description: 'Quore B2B Marketing is a platform designed to help businesses streamline their marketing efforts and enhance customer engagement through innovative solutions.',
  icons: {
    icon: '/favicon.ico'
  }
};

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className="min-h-screen flex flex-col">
        <AdminAuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
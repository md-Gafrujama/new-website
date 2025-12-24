
import './globals.css';
import { Quicksand } from 'next/font/google';
import Script from 'next/script';

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
    <html lang="en" className={quicksand.variable} suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const shouldBeDark = theme ? theme === 'dark' : prefersDark;
                  
                  const html = document.documentElement;
                  if (shouldBeDark) {
                    html.classList.add('dark');
                    html.style.colorScheme = 'dark';
                  } else {
                    html.classList.remove('dark');
                    html.style.colorScheme = 'light';
                  }
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300 overflow-x-hidden">
        <AdminAuthProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { QueryProvider } from '@/components/layout/QueryProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata = {
  title: { default: 'LuxeWear – Premium Intimates', template: '%s | LuxeWear' },
  description: 'Premium undergarments and intimate wear crafted for comfort, style, and confidence.',
  keywords: ['undergarments', 'intimates', 'luxe', 'premium', 'comfort wear'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                className: 'text-sm font-sans',
                style: { borderRadius: '8px', padding: '12px 16px' },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

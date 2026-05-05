import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { QueryProvider } from '@/components/layout/QueryProvider';
import StoreProvider from '@/components/layout/StoreProvider';
import { TemplateNavbar, TemplateFooter } from '@/components/layout/TemplateRenderer';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: { default: 'My Store', template: '%s | My Store' },
  description: 'Premium products crafted for comfort, style, and confidence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn('font-sans', geist.variable)}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <QueryProvider>
            <StoreProvider>
              <div className="min-h-screen flex flex-col">
                <TemplateNavbar />
                <main className="flex-1">{children}</main>
                <TemplateFooter />
              </div>
              <Toaster
                position="top-right"
                toastOptions={{
                  className: 'text-sm font-sans',
                  style: { borderRadius: '8px', padding: '12px 16px' },
                }}
              />
            </StoreProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

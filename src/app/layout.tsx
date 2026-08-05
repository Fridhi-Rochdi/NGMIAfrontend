import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';
import { AppearanceProvider } from '@/hooks/useAppearance';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextGen MarketingAI',
  description: 'AI-powered marketing platform for SMEs',
  icons: {
    icon: '/nextgen-mark.svg',
    shortcut: '/nextgen-mark.svg',
    apple: '/nextgen-mark.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <AppearanceProvider>
            {children}
          </AppearanceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

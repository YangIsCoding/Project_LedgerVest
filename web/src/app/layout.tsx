import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { WalletProvider } from '@/lib/context/WalletContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LedgerVest - Decentralized Investment Platform',
  description:
    'A transparent, fair, and decentralized investment and lending platform ensuring trust and security between investors and borrowing companies.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <WalletProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="grow bg-white text-gray-800 dark:bg-black dark:text-white-200">
                {children}
              </main>
              <Footer />
            </div>
          </WalletProvider>
        </Providers>
      </body>
    </html>
  );
}

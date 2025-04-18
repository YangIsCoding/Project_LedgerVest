// src/app/layout.tsx
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { Inter } from 'next/font/google';
import './globals.css';
import { cookieToInitialState } from 'wagmi';
import { getConfig } from '../../wagmi.config';
import { Providers } from './providers'; // Assuming this wraps WagmiProvider
import { WalletProvider } from '@/lib/context/WalletContext'; // Keep if still needed elsewhere
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SessionWrapper from './SessionWrapper'; // Wraps SessionProvider
import WalletAutoConnector from '@/components/WalletAutoConnector'; // ✅ Import the auto-connector

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LedgerVest - Decentralized Investment Platform',
  description:
    'A transparent, fair, and decentralized investment and lending platform ensuring trust and security between investors and borrowing companies.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get('cookie') ?? ''
  );

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* SessionWrapper likely contains SessionProvider */}
        <SessionWrapper>
          {/* Providers likely contains WagmiProvider */}
          <Providers initialState={initialState}>
            {/* WalletProvider might be redundant if only using wagmi state */}
            <WalletProvider>
              {/* ✅ Place WalletAutoConnector inside Providers and SessionWrapper */}
              <WalletAutoConnector />
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="grow bg-white text-gray-800 dark:bg-black dark:text-white-200">
                  {children}
                </main>
                <Footer />
              </div>
            </WalletProvider>
          </Providers>
        </SessionWrapper>
      </body>
    </html>
  );
}
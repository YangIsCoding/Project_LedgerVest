// src/app/ClientProviders.tsx
export const dynamic = 'force-dynamic';
'use client';

import { ReactNode, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { getConfig } from '@/../../web/wagmi.config';          // ← 路徑依實際放置調整
import { WalletProvider } from '@/lib/context/WalletContext';

import '@rainbow-me/rainbowkit/styles.css';

type Props = { children: ReactNode };

export function ClientProviders({ children }: Props) {
  /* ────── 1. 建立 wagmi 設定 & React-Query client ────── */
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  /* ────── 2. RainbowKit APP metadata ────── */
  const appInfo = { appName: 'LedgerVest' };

  /* ────── 3. provider 樹 ────── */
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
         <RainbowKitProvider appInfo={appInfo} locale="en">
          <WalletProvider>
            {children}
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

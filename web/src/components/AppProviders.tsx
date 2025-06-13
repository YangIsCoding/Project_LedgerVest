// src/components/AppProviders.tsx
'use client';

import { ReactNode, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WalletProvider } from '@/lib/context/WalletContext';
import { getConfig } from '@/../../web/wagmi.config';
import '@rainbow-me/rainbowkit/styles.css';

export function AppProviders({ children }: { children: ReactNode }) {
  const [qc] = useState(() => new QueryClient());
  const [config] = useState(() => getConfig());
  const appInfo = { appName: 'LedgerVest' };

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={qc}>
        <RainbowKitProvider appInfo={appInfo}>
          <WalletProvider>{children}</WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

'use client'

import { WagmiProvider, http, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { sepolia } from 'wagmi/chains'
import { ReactNode } from 'react'

/* ----------  wagmi Config  ---------- */
export const wagmiConfig = createConfig({
  ssr: true,              // 🟢 打開伺服器端支援
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/Vy3y1zaFvBXDAk-xd-jn98E623e-0Raf'), // ← 你的 RPC
  },
})

/* ----------  React Query  ---------- */
const queryClient = new QueryClient()

/* ----------  統一 Provider  ---------- */
export default function Web3Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

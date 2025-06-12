'use client';

import { createConfig, http, cookieStorage, createStorage } from 'wagmi';
import {
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  linea,
  lineaSepolia,
} from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit'; // 新增這行

export const chains = [
  sepolia,
  mainnet,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  linea,
  lineaSepolia,
] as const;

// getDefaultWallets 會自動把 MetaMask + RainbowKit 推薦的 wallets + WalletConnect 都加進 connectors 裡
const { connectors } = getDefaultWallets({
  appName: 'LedgerVest',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // 這個要填 (你可以自己去 WalletConnect project 新建一個 Project ID，免費)
});

const config = createConfig({
  chains,
  connectors, // 用這裡的 connectors，不用自己寫 metaMask()
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [polygonMumbai.id]: http(),
    [arbitrum.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimism.id]: http(),
    [optimismSepolia.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http(),
  },

});

export function getConfig() {
  return config;
}

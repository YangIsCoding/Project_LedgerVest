// wagmi.config.ts
import {
  createConfig,
  http,
  cookieStorage,
  createStorage,
} from 'wagmi';
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
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

/* ──────────────── 1. 鏈清單 ──────────────── */
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

/* ──────────────── 2. RainbowKit 預設錢包 + WalletConnect ──────────────── */
const { connectors } = getDefaultWallets({
  appName: 'LedgerVest',
  // 到 https://cloud.walletconnect.com 申請一個專案，複製 Project ID
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
});

/* ──────────────── 3. wagmi 全域設定 ──────────────── */
const config = createConfig({
  ssr: true,                      // ← 必開：讓 wagmi 知道要在 SSR 環境運行
  connectors,                     // RainbowKit 的 connectors
  chains,                         // 支援的鏈
  transports: {
    [sepolia.id]: http(),         // 預設用 public RPC；正式環境建議填 Infura/Alchemy
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

  /* 👇 關鍵：把 WalletConnect 的持久化層改成 cookieStorage，   */
  /*    這樣它就不會去建 IndexedDBStore → build 時不再找 indexedDB */
  storage: createStorage({
    storage: cookieStorage,
  }),
});

/* ──────────────── 4. 匯出 helper ──────────────── */
export function getConfig() {
  return config;
}

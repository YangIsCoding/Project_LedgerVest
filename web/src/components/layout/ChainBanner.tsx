'use client';

import { useEffect, useState } from 'react';
import { useChainId } from 'wagmi';

const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum Mainnet',
  11155111: 'Sepolia Testnet',
  137: 'Polygon',
  80001: 'Polygon Mumbai',
  42161: 'Arbitrum',
  421614: 'Arbitrum Sepolia',
  10: 'Optimism',
  11155420: 'Optimism Sepolia',
  59144: 'Linea',
  59140: 'Linea Sepolia',
};

interface PriceInfo {
  symbol: string;
  price: number;
  change: number;
}

export default function ChainBanner() {
  const chainId = useChainId();
  const [prices, setPrices] = useState<PriceInfo[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
        );
        const data = await res.json();
        const formatted: PriceInfo[] = [
          {
            symbol: 'BTC',
            price: data.bitcoin.usd,
            change: data.bitcoin.usd_24h_change,
          },
          {
            symbol: 'ETH',
            price: data.ethereum.usd,
            change: data.ethereum.usd_24h_change,
          },
          {
            symbol: 'SOL',
            price: data.solana.usd,
            change: data.solana.usd_24h_change,
          },
        ];
        setPrices(formatted);
      } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 60000); // 每分鐘更新一次
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full overflow-hidden whitespace-nowrap bg-black text-white text-sm py-2">
      <div className="animate-marquee inline-block min-w-full">
        <span className="mr-8 text-green-400">
          🟢 Connected to: {CHAIN_NAMES[chainId] || `Chain ${chainId}`}
        </span>
        {prices.map((coin) => (
          <span key={coin.symbol} className="mr-8">
            {coin.symbol}:{' '}
            ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
            <span className={coin.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              ({coin.change >= 0 ? '+' : ''}
              {coin.change.toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>

      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

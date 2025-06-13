'use client';

import dynamic from 'next/dynamic';

const ConnectButton = dynamic(
  () => import('@rainbow-me/rainbowkit').then((mod) => mod.ConnectButton),
  { ssr: false }
);

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-8 bg-white rounded shadow text-center">
                <h2 className="text-2xl font-bold mb-6">Connect your Wallet</h2>
                <p className="mb-4 text-gray-600">
                    Please connect your wallet to access LedgerVest.
                </p>
                <div className="flex justify-center">
                    <ConnectButton />
                </div>
            </div>
        </div>
    );
}

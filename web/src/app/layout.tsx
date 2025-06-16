// src/app/layout.tsx
export const dynamic = 'force-dynamic'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { AppProviders } from '@/components/AppProviders'  // ← WagmiProvider 等都在這

import '@/polyfills/fdidb'

const inter = Inter( { subsets: [ 'latin' ] } )


export const metadata: Metadata = {
  title: 'LedgerVest',
  description: 'A transparent, fair, and decentralized investment and lending platform.',
  openGraph: {
    title: 'LedgerVest',
    description: 'Secure Investments Through Blockchain Technology',
    images: [
      {
        url: '@/../public/hero-image.png',
        width: 1200,
        height: 630,
        alt: 'LedgerVest Preview Image',
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AppProviders>

        {/* 如需在 Footer 也取用 wagmi，把它移進 AppProviders */}
        <Footer />
      </body>
    </html>
  )
}

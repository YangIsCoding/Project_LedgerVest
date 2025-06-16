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
        url: 'https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-1bf4-622f-b77c-0a5cc0a2f9cb/raw?se=2025-06-16T20%3A22%3A02Z&sp=r&sv=2024-08-04&sr=b&scid=e53f779e-74bb-5807-b476-0a3976183a9d&skoid=e9d2f8b1-028a-4cff-8eb1-d0e66fbefcca&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-16T01%3A32%3A04Z&ske=2025-06-17T01%3A32%3A04Z&sks=b&skv=2024-08-04&sig=ePs8xBohk067G4w8T2nojM5HuvFSX3U2TNUOMS71xIk%3D',
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

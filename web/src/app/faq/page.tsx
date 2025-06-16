// app/faq/page.tsx
import React from 'react';

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: 2025-06-16</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-2">What is LedgerVest?</h2>
          <p>
            LedgerVest is a decentralized crowdfunding platform that allows fund seekers to raise funds through smart contracts. Contributors can transparently track fund usage and participate in fund approval.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Do I need an account to use LedgerVest?</h2>
          <p>
            No. LedgerVest is fully decentralized. You only need a supported crypto wallet (e.g. MetaMask, Rainbow, WalletConnect) to connect and interact with campaigns.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How do I create a campaign?</h2>
          <p>
            After connecting your wallet, go to the "Create Campaign" page, enter the necessary details such as title, description, target amount, and minimum contribution, and deploy your campaign using your wallet.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How are contributions stored?</h2>
          <p>
            All contributions are stored directly in the campaign’s smart contract. The contract ensures that funds can only be used once requests are created and approved by contributors.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How can I track my contributions?</h2>
          <p>
            Go to your Dashboard after connecting your wallet. You’ll be able to see your contribution history, campaigns you’ve interacted with, and pending votes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Is LedgerVest secure?</h2>
          <p>
            LedgerVest uses audited smart contracts and secure wallet connections. However, as with all blockchain applications, users are responsible for managing their own private keys and wallet security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">What networks does LedgerVest support?</h2>
          <p>
            Currently, LedgerVest supports Ethereum Sepolia Testnet for development. Mainnet and other networks (like Polygon or Arbitrum) may be supported in future versions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Where can I get support?</h2>
          <p>
            You can contact our support team via{' '}
            <a href="/contact" className="text-blue-600 underline">
              contact us
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}

// app/privacy-policy/page.tsx
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: 2025-06-16</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>
          LedgerVest is committed to protecting your privacy. This Privacy Policy explains what data we collect, how we use it, and your rights.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p>
          We do not collect any personal information such as your name, email address, or physical location by default. However, we may collect:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Public wallet address</li>
          <li>Campaign interaction history</li>
          <li>On-chain transaction data</li>
          <li>Browser and device metadata (for analytics)</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Data</h2>
        <p>
          We use the data we collect to:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Display and manage your dashboard and campaign data</li>
          <li>Improve our product and user experience</li>
          <li>Monitor platform usage (aggregated and anonymized)</li>
        </ul>
        <p className="mt-2">
          We never sell your data to third parties.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Cookies and Local Storage</h2>
        <p>
          We may use cookies or browser-based storage to remember your wallet connection and preferences. These do not store personally identifiable information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Third-Party Services</h2>
        <p>
          We may use third-party services like analytics tools, wallet providers, or blockchain APIs. These services may collect limited technical data according to their own privacy policies.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
        <p>
          LedgerVest does not store sensitive information such as private keys. All blockchain interactions occur through your connected wallet and are secured by Web3 standards.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Your Rights</h2>
        <p>
          Since we do not store user-identifiable data, we cannot fulfill requests to delete or modify such data. You retain full control of your wallet and can disconnect at any time.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Contact</h2>
        <p>
          If you have questions or concerns about this Privacy Policy, contact us at{' '}
          <a href="/contact" className="text-blue-600 underline">
            contact us
          </a>.
        </p>
      </section>

      <p className="mt-8 italic text-gray-600">
        By using LedgerVest, you agree to the terms outlined in this Privacy Policy.
      </p>
    </div>
  );
}

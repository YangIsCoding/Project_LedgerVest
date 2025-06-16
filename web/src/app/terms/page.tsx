// app/terms-of-service/page.tsx (or wherever you route this page)
import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl text-gray-800">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: 2025-06-16</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Nature of the Platform</h2>
        <p>
          LedgerVest is a decentralized fundraising platform built on blockchain technology.
          It allows users to create and contribute to campaigns using smart contracts. We do <strong>not</strong> hold user funds or directly manage campaigns.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Eligibility</h2>
        <p>
          You must be at least 18 years old and capable of forming legally binding contracts in your jurisdiction. By using LedgerVest, you confirm that you meet these requirements.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Wallets and Blockchain Use</h2>
        <p>
          You are responsible for your Web3 wallet, private keys, and seed phrases. LedgerVest cannot recover lost credentials and does not store wallet information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Campaign Responsibility</h2>
        <p>
          Campaign creators are solely responsible for the content and delivery of their campaigns. LedgerVest does not guarantee legitimacy or results.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Platform Risk Disclaimer</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Smart contracts may contain bugs or vulnerabilities.</li>
          <li>Blockchain transactions are irreversible.</li>
          <li>Token values are volatile and subject to market risk.</li>
          <li>Regulatory changes may affect your use of the platform.</li>
        </ul>
        <p className="mt-2">
          By using LedgerVest, you accept these risks.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Prohibited Use</h2>
        <p>Users may not:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Engage in fraud or misleading campaigns</li>
          <li>Launder money or evade sanctions</li>
          <li>Use the platform for illegal activities</li>
        </ul>
        <p className="mt-2">
          Violations may lead to permanent suspension from the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Limitation of Liability</h2>
        <p>
          LedgerVest and its contributors shall not be liable for any damages, including loss of funds or service outages, arising from use of the platform.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
        <p>
          We may update these Terms of Service at any time. Continued use of LedgerVest constitutes your acceptance of the updated terms.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Contact</h2>
        <p>
          For questions, please contact us at <a href="/contact" className="text-blue-600 underline">contact us</a>.
        </p>
      </section>

      <p className="mt-8 italic text-gray-600">
        By using LedgerVest, you acknowledge that you have read, understood, and agreed to these Terms of Service.
      </p>
    </div>
  );
}

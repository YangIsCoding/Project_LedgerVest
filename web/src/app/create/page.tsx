'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getFactoryContractWithSigner } from '@/utils/ethers';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { ethers } from 'ethers';
import CreateCampaignForm from '@/components/create/CreateCampaignForm';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { isConnected } = useWallet();

  // Form state
  const [minimumContribution, setMinimumContribution] = useState('');

  // UI state
  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();

    if (!minimumContribution) {
      setMessage({ text: 'Please enter a minimum contribution amount', type: 'error' });
      return;
    }

    try {
      setIsCreating(true);
      setMessage({ text: '', type: '' });

      // Convert ETH to wei
      const minimumInWei = ethers.parseEther(minimumContribution);

      // Get factory contract with signer
      const factoryWithSigner = await getFactoryContractWithSigner();

      // Create campaign transaction
      setMessage({ text: 'Creating campaign...', type: 'info' });
      const tx = await factoryWithSigner.createCampaign(minimumInWei);

      // Wait for transaction to complete
      setMessage({ text: 'Transaction submitted. Waiting for confirmation...', type: 'info' });
      await tx.wait();

      // Success! Show message and redirect
      setMessage({
        text: 'Campaign created successfully! Redirecting to home page...',
        type: 'success'
      });

      // Clear form
      setMinimumContribution('');

      // Redirect after a short delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      console.error("Create campaign failed:", err);
      setMessage({
        text: err.reason || err.message || 'Failed to create campaign. Please try again.',
        type: 'error'
      });
    } finally {
      setIsCreating(false);
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-xs">
          <FaExclamationTriangle className="text-4xl text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
          <p className="mb-4 text-gray-600">Please connect your wallet to create a campaign.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="flex items-center text-blue-600 mb-6">
        <FaArrowLeft className="mr-2" /> Back to Campaigns
      </Link>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' :
          message.type === 'success' ? 'bg-green-100 text-green-700' :
            'bg-blue-100 text-blue-700'
          }`}>
          {message.type === 'error' ? <FaExclamationTriangle className="inline mr-2" /> :
            message.type === 'success' ? <FaCheckCircle className="inline mr-2" /> : null}
          {message.text}
        </div>
      )}

      <CreateCampaignForm
        minimumContribution={minimumContribution}
        setMinimumContribution={setMinimumContribution}
        handleCreateCampaign={handleCreateCampaign}
        isCreating={isCreating}
      />
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getFactoryContractWithSigner } from '@/utils/ethers';
import { FaArrowLeft, FaEthereum, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { ethers } from 'ethers';
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
        <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
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
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'error' ? 'bg-red-100 text-red-700' : 
          message.type === 'success' ? 'bg-green-100 text-green-700' : 
          'bg-blue-100 text-blue-700'
        }`}>
          {message.type === 'error' ? <FaExclamationTriangle className="inline mr-2" /> : 
           message.type === 'success' ? <FaCheckCircle className="inline mr-2" /> : null}
          {message.text}
        </div>
      )}
      
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Create a New Campaign</h1>
            
            <form onSubmit={handleCreateCampaign}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Contribution (ETH)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEthereum className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={minimumContribution}
                    onChange={(e) => setMinimumContribution(e.target.value)}
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg"
                    placeholder="0.01"
                    step="0.000000000000000001"
                    min="0"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">ETH</span>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This is the minimum amount that contributors must provide to become approvers.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="text-md font-semibold text-blue-700 mb-2">
                  What happens when you create a campaign?
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• You will be designated as the campaign manager</li>
                  <li>• You can create requests to spend the campaign funds</li>
                  <li>• Contributors can approve spending requests</li>
                  <li>• You can finalize requests once they have sufficient approvals</li>
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Link href="/" className="mr-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${
                    isCreating ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isCreating ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>
                  ) : (
                    'Create Campaign'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
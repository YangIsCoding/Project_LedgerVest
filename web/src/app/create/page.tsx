'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getFactoryContractWithSigner } from '@/utils/ethers';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { ethers, Interface } from 'ethers';
import CreateCampaignForm from '@/components/create/CreateCampaignForm';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { isConnected, account: walletAddress } = useWallet();

  const [minimumContribution, setMinimumContribution] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const [isCreating, setIsCreating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  async function handleCreateCampaign(e: React.FormEvent) {
    e.preventDefault();

    if (!minimumContribution || !title || !targetAmount) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      return;
    }

    try {
      setIsCreating(true);
      setMessage({ text: '', type: '' });

      const minimumInWei = ethers.parseEther(minimumContribution);
      const factoryWithSigner = await getFactoryContractWithSigner();

      setMessage({ text: 'Creating campaign...', type: 'info' });
      const tx = await factoryWithSigner.createCampaign(minimumInWei, {
        value: ethers.parseEther("0.02"),
      });

      const receipt = await tx.wait();

      // Parse logs to extract campaign address
      const factoryInterface = new Interface([
        'event CampaignCreated(address campaignAddress, address creator)'
      ]);

      let campaignAddress = '';

      for (const log of receipt.logs) {
        try {
          const parsed = factoryInterface.parseLog(log) as ethers.LogDescription;
          if (parsed.name === 'CampaignCreated') {
            campaignAddress = parsed.args.campaignAddress;
            break;
          }
        } catch {
          // Skip non-matching logs
        }
      }

      if (!campaignAddress) {
        throw new Error('❌ Failed to extract campaign address from logs');
      }

      const gasCost = tx.gasPrice && receipt.gasUsed
        ? ethers.formatEther(tx.gasPrice * receipt.gasUsed)
        : '0';

      await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          minimumContribution,
          targetAmount,
          walletAddress,
          contractAddress: campaignAddress,
          gasCost,
          commission: '0.01',
        })
      });

      setMessage({
        text: 'Campaign created successfully! Redirecting to home page...',
        type: 'success'
      });

      setMinimumContribution('');
      setTitle('');
      setDescription('');
      setTargetAmount('');

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
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'error' ? 'bg-red-100 text-red-700' :
          message.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {message.type === 'error' && <FaExclamationTriangle className="inline mr-2" />}
          {message.type === 'success' && <FaCheckCircle className="inline mr-2" />}
          {message.text}
        </div>
      )}

      <CreateCampaignForm
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
        minimumContribution={minimumContribution}
        setMinimumContribution={setMinimumContribution}
        targetAmount={targetAmount}
        setTargetAmount={setTargetAmount}
        handleCreateCampaign={handleCreateCampaign}
        isCreating={isCreating}
      />
    </div>
  );
}

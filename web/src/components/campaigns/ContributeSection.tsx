import React from 'react';
import { FaCheckCircle, FaEthereum, FaWallet } from 'react-icons/fa';

interface ContributeSectionProps {
  isApprover: boolean;
  contributionAmount: string;
  setContributionAmount: (amount: string) => void;
  minimumContribution: string;
  handleContribute: () => Promise<void>;
  isContributing: boolean;
  displayEther: (wei: string) => string;
}

export default function ContributeSection({
  isApprover,
  contributionAmount,
  setContributionAmount,
  minimumContribution,
  handleContribute,
  isContributing,
  displayEther,
}: ContributeSectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-xs overflow-hidden sticky top-6">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Contribute to Campaign</h2>

        {isApprover ? (
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <FaCheckCircle className="text-green-500 inline mr-2" />
            <span className="text-green-700">You're already a contributor!</span>
          </div>
        ) : null}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Contribute (ETH)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEthereum className="text-gray-400" />
            </div>
            <input
              type="number"
              value={contributionAmount}
              onChange={(e) => setContributionAmount(e.target.value)}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md"
              placeholder="0.00"
              step="0.0001"
              min={displayEther(minimumContribution)}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500">ETH</span>
            </div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Minimum: {displayEther(minimumContribution)} ETH
          </p>
        </div>

        <button
          onClick={handleContribute}
          disabled={isContributing}
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center ${
            isContributing ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isContributing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <FaWallet className="mr-2" />
              Contribute
            </>
          )}
        </button>

        <div className="mt-4 text-sm text-gray-500">
          By contributing, you'll become an approver and be able to vote on spending requests.
        </div>
      </div>
    </div>
  );
}
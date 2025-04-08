import React from 'react';
import { FaEthereum } from 'react-icons/fa';
import Link from 'next/link';

interface CreateCampaignFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  minimumContribution: string;
  setMinimumContribution: (value: string) => void;
  targetAmount: string;
  setTargetAmount: (value: string) => void;
  handleCreateCampaign: (e: React.FormEvent) => Promise<void>;
  isCreating: boolean;
}

const CreateCampaignForm: React.FC<CreateCampaignFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  minimumContribution,
  setMinimumContribution,
  targetAmount,
  setTargetAmount,
  handleCreateCampaign,
  isCreating,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-xs overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Create a New Campaign</h1>

          <form onSubmit={handleCreateCampaign}>
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="My Awesome Campaign"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Describe your campaign's purpose and goals..."
                rows={4}
                required
              />
            </div>

            {/* Target Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Amount (ETH)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEthereum className="text-gray-400" />
                </div>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg"
                  placeholder="1.00"
                  step="0.000000000000000001"
                  min="0"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">ETH</span>
                </div>
              </div>
            </div>

            {/* Minimum Contribution */}
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

            {/* Info Box */}
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

            {/* Buttons */}
            <div className="flex justify-end">
              <Link href="/" className="mr-3 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isCreating}
                className={`bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 ${isCreating ? 'opacity-75 cursor-not-allowed' : ''
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
  );
};

export default CreateCampaignForm;

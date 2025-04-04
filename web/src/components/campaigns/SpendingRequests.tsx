import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface SpendingRequestsProps {
  isManager: boolean;
  showCreateForm: boolean;
  setShowCreateForm: (show: boolean) => void;
  handleCreateRequest: (e: React.FormEvent) => Promise<void>;
  requestDescription: string;
  setRequestDescription: (description: string) => void;
  requestAmount: string;
  setRequestAmount: (amount: string) => void;
  requestRecipient: string;
  setRequestRecipient: (recipient: string) => void;
  isCreatingRequest: boolean;
  requests: any[];
  displayEther: (wei: string) => string;
  handleApproveRequest: (index: number) => Promise<void>;
  handleFinalizeRequest: (index: number) => Promise<void>;
  isApprover: boolean;
}

export default function SpendingRequests({
  isManager,
  showCreateForm,
  setShowCreateForm,
  handleCreateRequest,
  requestDescription,
  setRequestDescription,
  requestAmount,
  setRequestAmount,
  requestRecipient,
  setRequestRecipient,
  isCreatingRequest,
  requests,
  displayEther,
  handleApproveRequest,
  handleFinalizeRequest,
  isApprover,
}: SpendingRequestsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Spending Requests</h2>
          {isManager && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center text-sm"
            >
              <FaPlus className="mr-2" />
              {showCreateForm ? 'Cancel' : 'New Request'}
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Create New Request</h3>
            <form onSubmit={handleCreateRequest}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={requestDescription}
                  onChange={(e) => setRequestDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Purpose of the spending request"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (ETH)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* Ethereum Icon */}
                    <span className="text-gray-400">ETH</span>
                  </div>
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg"
                    placeholder="Amount in ETH"
                    step="0.0001"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Address</label>
                <input
                  type="text"
                  value={requestRecipient}
                  onChange={(e) => setRequestRecipient(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0x..."
                  required
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={isCreatingRequest}
                  className={`bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 ${
                    isCreatingRequest ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isCreatingRequest ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No spending requests have been created yet.</p>
            {isManager && !showCreateForm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center mx-auto"
              >
                <FaPlus className="mr-2" />
                Create First Request
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approvals</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.index}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{displayEther(request.value)} ETH</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${request.recipient.substring(0, 6)}...${request.recipient.substring(request.recipient.length - 4)}`}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.approvalCount}/{request.approvers}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${(request.approvalCount / request.approvers) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.complete ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!request.complete && isApprover && (
                        <button
                          onClick={() => handleApproveRequest(request.index)}
                          className={`text-blue-600 hover:text-blue-900 mr-4`}
                        >
                          Approve
                        </button>
                      )}
                      {!request.complete && isManager && (
                        <button
                          onClick={() => handleFinalizeRequest(request.index)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Finalize
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
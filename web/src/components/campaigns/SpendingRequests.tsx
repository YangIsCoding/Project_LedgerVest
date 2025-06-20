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
  console.log('Requests:', requests);

  return (
    <div className="bg-white rounded-lg shadow-xs overflow-hidden">
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
              {/* Description */}
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

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Value (ETH)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={requestAmount}
                    onChange={(e) => setRequestAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Amount in ETH"
                    step="0.0001"
                    min="0"
                    required
                  />
                </div>
              </div>

              {/* Recipient */}
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
                  <th>ID</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Recipient</th>
                  <th>Approvals</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.index}>
                    <td>{request.index}</td>
                    <td>
                      <div>{request.description}</div>
                      <p className="text-xs text-gray-500 mt-1">🕒 Created At: {request.timestamp}</p>
                    </td>
                    <td>{displayEther(request.value)} ETH</td>
                    <td>
                      {`${request.recipient.substring(0, 6)}...${request.recipient.substring(request.recipient.length - 4)}`}
                    </td>
                    <td>
                      {request.approvalCount}/{request.approvers}
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${(request.approvalCount / request.approvers) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td>
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
                    <td className="text-right">
                      {!request.complete && isApprover && (
                        <button
                          onClick={() => handleApproveRequest(request.index)}
                          disabled={request.hasApproved} // 禁止重複按
                          className={`text-blue-600 hover:text-blue-900 mr-4 ${request.hasApproved ? 'opacity-50 cursor-not-allowed' : ''}`}
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

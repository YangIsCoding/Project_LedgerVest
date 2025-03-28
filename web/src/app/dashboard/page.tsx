// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { MOCK_USER_INVESTMENTS, MOCK_WITHDRAWAL_REQUESTS, getProjectById } from '@/lib/utils/mockData';
import { FaDollarSign, FaProjectDiagram, FaChartLine, FaVoteYea, FaExchangeAlt } from 'react-icons/fa';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected, account } = useWallet();
  const [activeTab, setActiveTab] = useState('overview');
  const [userInvestments, setUserInvestments] = useState<any[]>([]);
  const [pendingVotes, setPendingVotes] = useState<any[]>([]);
  
  useEffect(() => {
    // Check if user is connected
    if (!isConnected) {
      // Redirect to home page if not connected
      router.push('/');
      return;
    }
    
    // Get user investments
    if (account) {
      // In a real app, you would fetch this data from the blockchain
      const investments = MOCK_USER_INVESTMENTS.filter(
        investment => investment.investorAddress.toLowerCase() === account.toLowerCase()
      );
      
      // Get the full project details for each investment
      const investmentsWithProjects = investments.map(investment => {
        const project = getProjectById(investment.projectId);
        return { ...investment, project };
      });
      
      setUserInvestments(investmentsWithProjects);
      
      // Get pending votes
      const votes = MOCK_WITHDRAWAL_REQUESTS.filter(
        request => request.status === 'pending'
      );
      
      setPendingVotes(votes);
    }
  }, [isConnected, account, router]);
  
  // Calculate total invested amount
  const totalInvested = userInvestments.reduce(
    (total, investment) => total + investment.amount,
    0
  );
  
  // Calculate total returns
  const totalReturns = userInvestments.reduce(
    (total, investment) => total + investment.returns,
    0
  );
  
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Connecting to wallet...</h1>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Investor Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-600 text-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white opacity-80 font-medium">Total Invested</h2>
              <p className="text-2xl font-bold mt-1">${totalInvested.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-25 p-2 rounded-full">
              <FaDollarSign />
            </div>
          </div>
        </div>
        
        <div className="bg-green-600 text-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white opacity-80 font-medium">Active Investments</h2>
              <p className="text-2xl font-bold mt-1">{userInvestments.length}</p>
            </div>
            <div className="bg-white bg-opacity-25 p-2 rounded-full">
              <FaProjectDiagram />
            </div>
          </div>
        </div>
        
        <div className="bg-cyan-600 text-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white opacity-80 font-medium">Earned Interest</h2>
              <p className="text-2xl font-bold mt-1">${totalReturns.toLocaleString()}</p>
            </div>
            <div className="bg-white bg-opacity-25 p-2 rounded-full">
              <FaChartLine />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-500 text-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white opacity-80 font-medium">Pending Votes</h2>
              <p className="text-2xl font-bold mt-1">{pendingVotes.length}</p>
            </div>
            <div className="bg-white bg-opacity-25 p-2 rounded-full">
              <FaVoteYea />
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('investments')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'investments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Investments
          </button>
          <button
            onClick={() => setActiveTab('voting')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'voting'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Voting Requests
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Transactions
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Recent Investments</h2>
              {userInvestments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userInvestments.slice(0, 3).map(investment => (
                        <tr key={investment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Link href={`/project/${investment.projectId}`} className="font-medium text-blue-600 hover:underline">
                              {investment.project?.title || `Project #${investment.projectId}`}
                            </Link>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">${investment.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{investment.project?.interestRate || 0}%</td>
                          <td className="px-6 py-4 whitespace-nowrap">${investment.returns.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {investment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">You don't have any investments yet.</p>
              )}
              
              {userInvestments.length > 3 && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setActiveTab('investments')}
                    className="text-blue-600 hover:underline"
                  >
                    View all investments
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Pending Votes</h2>
              {pendingVotes.length > 0 ? (
                <div className="space-y-4">
                  {pendingVotes.slice(0, 2).map(vote => {
                    const project = getProjectById(vote.projectId);
                    return (
                      <div key={vote.id} className="border rounded-lg p-4">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{project?.title || `Project #${vote.projectId}`}</h3>
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Amount: ${vote.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Purpose: {vote.purpose}</p>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Voting Progress</span>
                            <span>{vote.approvalCount + vote.rejectionCount} of 20 investors voted</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-l-full" 
                              style={{ width: `${(vote.approvalCount / 20) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mt-3 flex space-x-2">
                          <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                            Approve
                          </button>
                          <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                            Reject
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500">No pending votes at the moment.</p>
              )}
              
              {pendingVotes.length > 2 && (
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setActiveTab('voting')}
                    className="text-blue-600 hover:underline"
                  >
                    View all votes
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Investments Tab */}
        {activeTab === 'investments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">My Investments</h2>
              <Link href="/projects" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                New Investment
              </Link>
            </div>
            
            {userInvestments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Rate</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userInvestments.map(investment => (
                      <tr key={investment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/project/${investment.projectId}`} className="font-medium text-blue-600 hover:underline">
                            {investment.project?.title || `Project #${investment.projectId}`}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${getCategoryColor(investment.project?.category || '')}`}>
                            {investment.project?.category || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${investment.amount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{investment.project?.interestRate || 0}%</td>
                        <td className="px-6 py-4 whitespace-nowrap">{investment.project?.term || 0} months</td>
                        <td className="px-6 py-4 whitespace-nowrap">${investment.returns.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:underline">Details</button>
                            <button className="text-blue-600 hover:underline">Votes</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You don't have any investments yet.</p>
                <Link href="/projects" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Browse Projects
                </Link>
              </div>
            )}
          </div>
        )}
        
        {/* Voting Tab */}
        {activeTab === 'voting' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Voting Requests</h2>
            
            {pendingVotes.length > 0 ? (
              <div className="space-y-6">
                {pendingVotes.map(vote => {
                  const project = getProjectById(vote.projectId);
                  return (
                    <div key={vote.id} className="border rounded-lg p-6">
                      <div className="flex flex-wrap justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium">Fund Usage Request</h3>
                          <span className="mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Action Required
                          </span>
                        </div>
                        <div className="text-right mt-2 sm:mt-0">
                          <div className="font-medium">Expires in: {Math.ceil((vote.expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</div>
                          <div className="text-sm text-gray-500">Created: {vote.createdAt.toLocaleDateString()}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <div className={`${getCategoryColor(project?.category || '')} text-white p-2 rounded mr-2`}>
                                <FaProjectDiagram />
                              </div>
                              <div>
                                <div className="font-medium">{project?.title || `Project #${vote.projectId}`}</div>
                                <div className="text-gray-500">{project?.company || 'Unknown Company'}</div>
                              </div>
                            </div>
                            
                            <div className="border-b pb-4 mb-4">
                              <h4 className="font-medium mb-2">Fund Usage Purpose:</h4>
                              <p className="text-gray-700">{vote.purpose}</p>
                              <div className="mt-2">
                                <button className="text-sm text-blue-600 hover:underline flex items-center">
                                  <FaExchangeAlt className="mr-1" /> View Supporting Documents
                                </button>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Voting Status:</h4>
                              <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                                <div className="flex h-full">
                                  <div 
                                    className="bg-green-600 h-full" 
                                    style={{ width: `${(vote.approvalCount / 20) * 100}%` }}
                                  ></div>
                                  <div 
                                    className="bg-red-600 h-full" 
                                    style={{ width: `${(vote.rejectionCount / 20) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex justify-between text-sm mt-1">
                                <span>Approved: {vote.approvalCount} ({(vote.approvalCount / 20 * 100).toFixed(0)}%)</span>
                                <span>Rejected: {vote.rejectionCount} ({(vote.rejectionCount / 20 * 100).toFixed(0)}%)</span>
                              </div>
                              <p className="text-sm mt-2">
                                {vote.approvalCount + vote.rejectionCount} of 20 investors have voted (Minimum required: 60% approval)
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium mb-2">Request Details</h4>
                            <hr className="mb-3" />
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Amount:</span>
                                <span className="font-medium">${vote.amount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Interest Payment:</span>
                                <span className="font-medium">${(vote.amount * 0.05).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Voting Deadline:</span>
                                <span>{vote.expiresAt.toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Your Share:</span>
                                <span>8.0%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Your Interest:</span>
                                <span>${(vote.amount * 0.05 * 0.08).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <button className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                              Approve
                            </button>
                            <button className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                              Reject
                            </button>
                            <button className="w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                              Ask Questions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No pending votes at the moment.</p>
            )}
          </div>
        )}
        
        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Transaction History</h2>
            <p className="text-gray-500">Your transaction history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get category color
function getCategoryColor(category: string): string {
  const categoryColors: { [key: string]: string } = {
    'Technology': 'bg-blue-600',
    'Real Estate': 'bg-yellow-500',
    'Energy': 'bg-red-600',
    'Healthcare': 'bg-cyan-500',
    'Education': 'bg-gray-600',
    'Finance': 'bg-green-600',
    'Agriculture': 'bg-green-500'
  };
  
  return categoryColors[category] || 'bg-purple-500';
}
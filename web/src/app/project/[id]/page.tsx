// src/app/project/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { getProjectById } from '@/lib/utils/mockData';
import { FaArrowLeft, FaChartLine, FaUsers, FaCalendarAlt, FaMoneyBillWave, FaShieldAlt } from 'react-icons/fa';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { isConnected, account } = useWallet();
  const [project, setProject] = useState<any>(null);
  const [investmentAmount, setInvestmentAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect(() => {
    // In a real app, you would fetch this from the blockchain or API
    const projectData = getProjectById(id);
    if (projectData) {
      setProject(projectData);
    } else {
      // Project not found, redirect to projects page
      router.push('/projects');
    }
  }, [id, router]);
  
  const handleInvest = async () => {
    if (!isConnected) {
      alert('Please connect your wallet to invest');
      return;
    }
    
    if (!investmentAmount || parseFloat(investmentAmount) <= 0) {
      alert('Please enter a valid investment amount');
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, you would call your smart contract here
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert(`Investment of $${investmentAmount} submitted successfully!`);
      setInvestmentAmount('');
      
      // In a real app, you would refresh the project data here
    } catch (error) {
      console.error('Investment failed:', error);
      alert('Investment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4">Loading project details...</p>
      </div>
    );
  }
  
  const progress = Math.round((project.raised / project.target) * 100);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/projects" className="inline-flex items-center text-blue-600 mb-6 hover:underline">
        <FaArrowLeft className="mr-2" /> Back to Projects
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-wrap justify-between mb-4">
            <div>
              <span className={`inline-block ${getCategoryColor(project.category)} text-white text-sm font-semibold px-3 py-1 rounded-full mb-2`}>
                {project.category}
              </span>
              {project.hasCollateral && (
                <span className="inline-block bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded-full ml-2 mb-2">
                  With Collateral
                </span>
              )}
            </div>
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600 mb-6">by {project.company}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-2">
                <FaMoneyBillWave className="text-blue-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold">Funding Goal</h3>
                  <p className="text-2xl font-bold">${project.target.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>${project.raised.toLocaleString()} raised</span>
                <span>{progress}%</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-2">
                <FaChartLine className="text-blue-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold">Investment Terms</h3>
                  <p className="mt-1">Interest Rate: <span className="font-bold">{project.interestRate}%</span></p>
                  <p>Term Length: <span className="font-bold">{project.term} months</span></p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start mb-2">
                <FaCalendarAlt className="text-blue-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-semibold">Timeline</h3>
                  <p className="mt-1">Created: <span className="font-bold">{project.createdAt.toLocaleDateString()}</span></p>
                  <p>Days Left: <span className="font-bold">{project.daysLeft}</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Project Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
          </div>
          
          {project.hasCollateral && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Collateral Information</h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <FaShieldAlt className="text-green-600 mr-2" />
                  <span className="font-semibold">Secured Investment</span>
                </div>
                <p className="mb-2">This project is backed by collateral to protect investors.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Collateral Type</p>
                    <p className="font-semibold">{project.collateralType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Collateral Value</p>
                    <p className="font-semibold">${project.collateralValue?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Investment Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Investors</p>
                <p className="text-xl font-bold">{project.investors}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Minimum Investment</p>
                <p className="text-xl font-bold">$500</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Average Investment</p>
                <p className="text-xl font-bold">${Math.round(project.raised / project.investors).toLocaleString()}</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">Funding Needed</p>
                <p className="text-xl font-bold">${(project.target - project.raised).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 border-t p-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Invest in This Project</h2>
            {!isConnected ? (
              <div className="text-center bg-blue-50 rounded-lg p-4 mb-4">
                <p>Connect your wallet to invest in this project</p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="investmentAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Investment Amount (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <input
                      type="number"
                      id="investmentAmount"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="500"
                      className="pl-8 w-full rounded-md border-gray-300 border p-2"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum investment: $500</p>
                </div>
                
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Projected Returns</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Interest Rate</p>
                      <p className="font-semibold">{project.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Term</p>
                      <p className="font-semibold">{project.term} months</p>
                    </div>
                    {investmentAmount && !isNaN(parseFloat(investmentAmount)) && (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">Total Interest</p>
                          <p className="font-semibold">
                            ${(parseFloat(investmentAmount) * (project.interestRate / 100) * (project.term / 12)).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Return</p>
                          <p className="font-semibold">
                            ${(parseFloat(investmentAmount) + parseFloat(investmentAmount) * (project.interestRate / 100) * (project.term / 12)).toFixed(2)}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <button
              onClick={handleInvest}
              disabled={!isConnected || isLoading || !investmentAmount}
              className={`w-full py-3 px-4 rounded-md font-medium ${
                !isConnected || isLoading || !investmentAmount
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin h-5 w-5 mr-3 border-b-2 border-white rounded-full"></span>
                  Processing...
                </span>
              ) : (
                'Invest Now'
              )}
            </button>
            
            {!isConnected && (
              <p className="text-center text-sm mt-2 text-gray-600">
                You need to connect your wallet to invest
              </p>
            )}
          </div>
        </div>
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
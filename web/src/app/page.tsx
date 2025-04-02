'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWallet } from '@/lib/context/WalletContext';
import { getCampaignContract } from '@/utils/ethers';
import { FaUsers, FaProjectDiagram, FaCoins, FaUserPlus, 
         FaFileContract, FaHandHoldingUsd, FaChartLine, 
         FaShieldAlt, FaVoteYea, FaWallet, FaStar, 
         FaBalanceScale, FaFileInvoiceDollar, FaPlus, FaEthereum } from 'react-icons/fa';

// Campaign summary type
interface CampaignSummary {
  address: string;
  manager: string;
  minimumContribution: string;
  balance: string;
  approversCount: number;
  isLoading: boolean;
}

export default function Home() {
  const { isConnected, campaigns, loadCampaigns } = useWallet();
  const [campaignSummaries, setCampaignSummaries] = useState<CampaignSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 确保 campaigns 的引用稳定性
  const stableCampaigns = useMemo(() => campaigns, [campaigns]);

  // Load campaign list when wallet connects
  useEffect(() => {
    if (isConnected) {
      loadCampaigns();
    }
  }, [isConnected, loadCampaigns]);

  // Get summary data for each campaign
  useEffect(() => {
    const fetchCampaignSummaries = async () => {
      if (!isConnected || stableCampaigns.length === 0) {
        setCampaignSummaries([]); // 清空数据
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const summariesPromises = stableCampaigns.map(async (address) => {
          try {
            const campaign = await getCampaignContract(address);
            
            const manager = await campaign.manager();
            const minimumContribution = await campaign.minimumContribution();
            const approversCount = await campaign.approversCount();
            
            // Get balance from provider
            const provider = campaign.runner;
            const balance = await provider.getBalance(address);
            
            return {
              address,
              manager,
              minimumContribution: minimumContribution.toString(),
              balance: balance.toString(),
              approversCount: Number(approversCount),
              isLoading: false
            };
          } catch (error) {
            console.error(`Error fetching data for campaign ${address}:`, error);
            return {
              address,
              manager: 'Error loading',
              minimumContribution: '0',
              balance: '0',
              approversCount: 0,
              isLoading: false
            };
          }
        });
        
        // 一次性更新所有数据
        const results = await Promise.all(summariesPromises);
        setCampaignSummaries(results);
      } catch (error) {
        console.error("Error fetching campaign summaries:", error);
        setCampaignSummaries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignSummaries();
  }, [stableCampaigns, isConnected]);

  // Format the wei value to ETH with a given number of decimals
  const formatEther = (wei: string, decimals = 4) => {
    try {
      const ethValue = parseFloat(wei) / 1e18;
      return ethValue.toFixed(decimals);
    } catch (error) {
      return '0';
    }
  };

  return (
    <>
      {/* Hero Section - No changes needed to content */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Secure Investments Through Blockchain Technology
              </h1>
              <p className="text-xl mb-8">
                A transparent, fair, and decentralized investment and lending platform ensuring trust 
                and security between investors and borrowing companies.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/projects" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                  Get Started
                </Link>
                <Link href="#how-it-works" className="bg-transparent hover:bg-blue-500 border border-white px-6 py-3 rounded-lg font-semibold transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <Image 
                src="/images/hero-image.svg" 
                alt="Blockchain Investment" 
                width={600} 
                height={400}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - No changes needed */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FaUsers className="text-5xl text-blue-600 mb-4 mx-auto" />
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-gray-600">Active Investors</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FaProjectDiagram className="text-5xl text-blue-600 mb-4 mx-auto" />
              <h3 className="text-3xl font-bold">100+</h3>
              <p className="text-gray-600">Funded Projects</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <FaCoins className="text-5xl text-blue-600 mb-4 mx-auto" />
              <h3 className="text-3xl font-bold">$10M+</h3>
              <p className="text-gray-600">Total Investments</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - No changes needed */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our blockchain-based platform ensures transparency and security
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUserPlus className="text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-2">1. Connect Wallet</h4>
              <p className="text-gray-600">Connect your MetaMask wallet to start using the platform.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <FaFileContract className="text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-2">2. Submit/Browse</h4>
              <p className="text-gray-600">Companies submit proposals or investors browse existing projects.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHandHoldingUsd className="text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-2">3. Invest</h4>
              <p className="text-gray-600">Investors contribute funds securely via smart contracts.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <FaChartLine className="text-3xl" />
              </div>
              <h4 className="text-xl font-bold mb-2">4. Earn Returns</h4>
              <p className="text-gray-600">Receive interest and principal based on your investment share.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Campaigns Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Active Fundraising Campaigns</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our current campaigns and start investing today
            </p>
          </div>
          
          <div className="flex justify-end mb-6">
            <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center">
              <FaPlus className="mr-2" /> Create Campaign
            </Link>
          </div>
          
          {!isConnected ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg shadow-sm">
              <FaWallet className="text-5xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-4">Connect your wallet to view active campaigns and participate in fundraising.</p>
            </div>
          ) : isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : campaignSummaries.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">No Campaigns Found</h3>
              <p className="mb-4 text-gray-600">Be the first to create a fundraising campaign!</p>
              <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 inline-flex items-center">
                <FaPlus className="mr-2" /> Create Campaign
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {campaignSummaries.slice(0, 3).map((campaign) => (
                <div key={campaign.address} className="border rounded-lg shadow-sm overflow-hidden bg-white">
                  <div className="border-b p-4">
                    <h2 className="font-semibold text-lg mb-1 break-all">
                      <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline">
                        Campaign @ {campaign.address.substring(0, 10)}...
                      </Link>
                    </h2>
                    <p className="text-sm text-gray-500">Manager: {campaign.manager.substring(0, 10)}...</p>
                  </div>
                  
                  <div className="p-4 bg-gray-50">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Minimum</div>
                        <div className="font-medium flex items-center justify-center">
                          <FaEthereum className="mr-1 text-gray-700" />
                          <span>{formatEther(campaign.minimumContribution)} ETH</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Balance</div>
                        <div className="font-medium flex items-center justify-center">
                          <FaEthereum className="mr-1 text-gray-700" />
                          <span>{formatEther(campaign.balance)} ETH</span>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Contributors</div>
                        <div className="font-medium flex items-center justify-center">
                          <FaUsers className="mr-1 text-gray-700" />
                          <span>{campaign.approversCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t flex justify-end">
                    <Link href={`/campaigns/${campaign.address}`} className="text-blue-600 hover:underline text-sm">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {isConnected && campaignSummaries.length > 3 && (
            <div className="text-center mt-8">
              <Link href="/projects" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 inline-block">
                View All Campaigns
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section - No changes needed */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              What makes our platform unique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaShieldAlt className="text-2xl text-blue-600 mr-3" />
                <h4 className="text-xl font-bold">Investor Protection</h4>
              </div>
              <p className="text-gray-600">
                Collateral mechanisms and voting systems ensure your investments are protected.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaVoteYea className="text-2xl text-blue-600 mr-3" />
                <h4 className="text-xl font-bold">Fund Approval</h4>
              </div>
              <p className="text-gray-600">
                Investors vote on fund usage to ensure transparency and proper allocation.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaWallet className="text-2xl text-blue-600 mr-3" />
                <h4 className="text-xl font-bold">Secure Transactions</h4>
              </div>
              <p className="text-gray-600">
                All transactions are managed through secure smart contracts on the blockchain.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaStar className="text-2xl text-blue-600 mr-3" />
                <h4 className="text-xl font-bold">Credit Scoring</h4>
              </div>
              <p className="text-gray-600">
                Companies build reputation through successful repayments and responsible fund usage.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaBalanceScale className="text-2xl text-blue-600 mr-3" />
                <h4 className="text-xl font-bold">Risk Grading</h4>
              </div>
              <p className="text-gray-600">
                Investment opportunities are graded to help investors choose based on risk tolerance.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <FaFileInvoiceDollar className="text-2xl text-blue-600 mr-3" />
                <h4 className="text-xl font-bold">Automated Payments</h4>
              </div>
              <p className="text-gray-600">
                Interest and principal payments are distributed automatically based on investment proportion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Investing?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join our platform today and discover new investment opportunities.
          </p>
          <Link href="/projects" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors inline-block">
            Browse Projects
          </Link>
        </div>
      </section>
    </>
  );
}
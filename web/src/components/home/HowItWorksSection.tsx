import React from 'react';
import { FaUserPlus, FaFileContract, FaHandHoldingUsd, FaChartLine } from 'react-icons/fa';

interface HowItWorksSectionProps {
  // You can define props here if needed
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = () => {
  return (
    <section id="how-it-works" className="py-16 text-gray-800 dark:text-white-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our blockchain-based platform ensures transparency and security
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-xs border p-6 text-center">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <FaUserPlus className="text-3xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">1. Connect Wallet</h4>
            <p className="text-gray-600">Connect your MetaMask wallet to start using the platform.</p>
          </div>

          <div className="bg-white rounded-lg shadow-xs border p-6 text-center">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFileContract className="text-3xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">2. Submit/Browse</h4>
            <p className="text-gray-600">Companies submit proposals or investors browse existing projects.</p>
          </div>

          <div className="bg-white rounded-lg shadow-xs border p-6 text-center">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHandHoldingUsd className="text-3xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">3. Invest</h4>
            <p className="text-gray-600">Investors contribute funds securely via smart contracts.</p>
          </div>

          <div className="bg-white rounded-lg shadow-xs border p-6 text-center">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
              <FaChartLine className="text-3xl" />
            </div>
            <h4 className="text-xl font-bold mb-2">4. Earn Returns</h4>
            <p className="text-gray-600">Receive interest and principal based on your investment share.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
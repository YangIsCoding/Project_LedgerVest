import React from 'react';
import {
  FaShieldAlt, FaVoteYea, FaWallet, FaStar, FaBalanceScale, FaFileInvoiceDollar
} from 'react-icons/fa';

interface FeaturesSectionProps {
  // You can define props here if needed
}

const FeaturesSection: React.FC<FeaturesSectionProps> = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            What makes our platform unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-2xl text-blue-600 mr-3" />
              <h4 className="text-xl font-bold">Investor Protection</h4>
            </div>
            <p className="text-gray-600">
              Collateral mechanisms and voting systems ensure your investments are protected.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <FaVoteYea className="text-2xl text-blue-600 mr-3" />
              <h4 className="text-xl font-bold">Fund Approval</h4>
            </div>
            <p className="text-gray-600">
              Investors vote on fund usage to ensure transparency and proper allocation.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <FaWallet className="text-2xl text-blue-600 mr-3" />
              <h4 className="text-xl font-bold">Secure Transactions</h4>
            </div>
            <p className="text-gray-600">
              All transactions are managed through secure smart contracts on the blockchain.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <FaStar className="text-2xl text-blue-600 mr-3" />
              <h4 className="text-xl font-bold">Credit Scoring</h4>
            </div>
            <p className="text-gray-600">
              Companies build reputation through successful repayments and responsible fund usage.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <FaBalanceScale className="text-2xl text-blue-600 mr-3" />
              <h4 className="text-xl font-bold">Risk Grading</h4>
            </div>
            <p className="text-gray-600">
              Investment opportunities are graded to help investors choose based on risk tolerance.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
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
  );
};

export default FeaturesSection;
import React from 'react';
import {
  FaShieldAlt, FaVoteYea, FaWallet, FaStar, FaBalanceScale, FaFileInvoiceDollar
} from 'react-icons/fa';

interface FeaturesSectionProps {
  className?: string;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ className = '' }) => {
  return (
    <section className={`py-20 bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            What makes our platform unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: FaShieldAlt,
              title: 'Investor Protection',
              desc: 'Collateral mechanisms and voting systems ensure your investments are protected.',
            },
            {
              icon: FaVoteYea,
              title: 'Fund Approval',
              desc: 'Investors vote on fund usage to ensure transparency and proper allocation.',
            },
            {
              icon: FaWallet,
              title: 'Secure Transactions',
              desc: 'All transactions are managed through secure smart contracts on the blockchain.',
            },
            {
              icon: FaStar,
              title: 'Credit Scoring',
              desc: 'Companies build reputation through successful repayments and responsible fund usage.',
            },
            {
              icon: FaBalanceScale,
              title: 'Risk Grading',
              desc: 'Investment opportunities are graded to help investors choose based on risk tolerance.',
            },
            {
              icon: FaFileInvoiceDollar,
              title: 'Automated Payments',
              desc: 'Interest and principal payments are distributed automatically based on investment proportion.',
            },
          ].map(({ icon: Icon, title, desc }, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-xs p-6 hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-center mb-4">
                <Icon className="text-2xl text-blue-600 mr-3 transition-transform duration-200 group-hover:scale-110" />
                <h4 className="text-xl font-bold">{title}</h4>
              </div>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

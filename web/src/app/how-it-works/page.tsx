// src/app/how-it-works/page.tsx
import Link from 'next/link';
import { 
  FaUserPlus, 
  FaFileContract, 
  FaHandHoldingUsd, 
  FaChartLine, 
  FaVoteYea,
  FaCheckCircle,
  FaMoneyBillWave,
  FaShieldAlt,
  FaArrowRight
} from 'react-icons/fa';

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">How LedgerVest Works</h1>
      <p className="text-xl text-gray-600 max-w-4xl mx-auto text-center mb-12">
        Our blockchain-based platform ensures transparency, security, and trust between fundraisers and contributors.
      </p>

      {/* Main steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUserPlus className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">1. Connect Wallet</h3>
          <p className="text-gray-600">Connect your MetaMask wallet to our platform. This serves as your secure identity and allows you to interact with our smart contracts.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <FaFileContract className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">2. Create or Browse</h3>
          <p className="text-gray-600">Create your own fundraising campaign with a minimum contribution amount, or browse existing campaigns to support.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHandHoldingUsd className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">3. Contribute</h3>
          <p className="text-gray-600">Contribute ETH to campaigns you believe in. When you contribute, you become an approver who can vote on spending requests.</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <FaChartLine className="text-3xl" />
          </div>
          <h3 className="text-xl font-bold mb-2">4. Participate & Earn</h3>
          <p className="text-gray-600">Vote on fund allocation requests and help ensure transparency. As projects succeed, you may receive returns on your contribution.</p>
        </div>
      </div>

      {/* For Campaign Creators */}
      <div className="bg-blue-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">For Campaign Creators</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaFileContract />
              </div>
              <h3 className="font-bold text-lg">Create Campaign</h3>
            </div>
            <p className="text-gray-600">Set a minimum contribution amount and become the campaign manager. Your campaign will be visible to all potential contributors.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaMoneyBillWave />
              </div>
              <h3 className="font-bold text-lg">Spending Requests</h3>
            </div>
            <p className="text-gray-600">Create spending requests detailing how you plan to use the funds. These requests require approval from contributors.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaCheckCircle />
              </div>
              <h3 className="font-bold text-lg">Finalize & Receive</h3>
            </div>
            <p className="text-gray-600">Once enough approvals are received, you can finalize the request and the funds will be transferred to the specified recipient.</p>
          </div>
        </div>
      </div>

      {/* For Contributors */}
      <div className="bg-green-50 rounded-lg p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">For Contributors</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaHandHoldingUsd />
              </div>
              <h3 className="font-bold text-lg">Contribute ETH</h3>
            </div>
            <p className="text-gray-600">Find campaigns you believe in and contribute ETH. The minimum contribution is set by the campaign creator.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaVoteYea />
              </div>
              <h3 className="font-bold text-lg">Vote on Requests</h3>
            </div>
            <p className="text-gray-600">Review spending requests from campaign managers and vote to approve or reject them based on their merit.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaShieldAlt />
              </div>
              <h3 className="font-bold text-lg">Security & Transparency</h3>
            </div>
            <p className="text-gray-600">Funds cannot be spent without majority approval. All transactions are recorded on the blockchain for complete transparency.</p>
          </div>
        </div>
      </div>

      {/* Technical Overview */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Technical Overview</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-gray-700 mb-4">
            LedgerVest is built on Ethereum smart contracts that enforce rules for fundraising campaigns. The platform uses two main contracts:
          </p>
          
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>CampaignFactory:</strong> Creates new campaign contracts and keeps track of all deployed campaigns.</li>
            <li><strong>Campaign:</strong> Manages a single fundraising effort, including contributions, spending requests, and voting.</li>
          </ul>
          
          <p className="text-gray-700 mb-4">
            All transactions are verified and recorded on the Ethereum blockchain, ensuring transparency and preventing fraud.
            Smart contracts enforce the rules, such as requiring majority approval before funds can be spent.
          </p>
          
          <p className="text-gray-700">
            The entire platform is decentralized, meaning there is no central authority controlling the funds or making decisions.
            All actions are executed through secure, peer-to-peer transactions on the blockchain.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Join our platform today and be part of the decentralized fundraising revolution.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/projects" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center">
            Browse Campaigns <FaArrowRight className="ml-2" />
          </Link>
          <Link href="/create" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center">
            Create Campaign <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
// src/app/about/page.tsx
export const dynamic = 'force-dynamic';
import Link from 'next/link';
import {
  FaUsers,
  FaShieldAlt,
  FaLightbulb,
  FaHandshake,
  FaGlobe,
  FaLock,
  FaBalanceScale,
  FaArrowRight
} from 'react-icons/fa';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">About LedgerVest</h1>
      <p className="text-xl text-gray-600 max-w-4xl mx-auto text-center mb-12">
        Revolutionizing fundraising with blockchain technology to create a transparent, fair, and secure platform for everyone.
      </p>

      {/* Our Mission */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Mission</h2>
        <div className="bg-blue-50 rounded-lg p-8">
          <p className="text-center text-lg text-gray-700 mb-0 italic">
            "To democratize fundraising by leveraging blockchain technology, creating a transparent ecosystem where investors and fundraisers can transact with confidence, free from intermediaries and traditional barriers."
          </p>
        </div>
      </div>

      {/* Why LedgerVest */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Why LedgerVest?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-xs p-6 text-center">
            <FaShieldAlt className="text-4xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Security First</h3>
            <p className="text-gray-600">
              Our platform is built on Ethereum blockchain technology, ensuring secure transactions and immutable records. Smart contracts enforce contribution and spending rules automatically.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6 text-center">
            <FaLightbulb className="text-4xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Transparent Funding</h3>
            <p className="text-gray-600">
              Every transaction is recorded on the blockchain and visible to all participants. Campaign managers must request and receive approval before spending funds.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6 text-center">
            <FaHandshake className="text-4xl text-blue-600 mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-2">Community Governed</h3>
            <p className="text-gray-600">
              Contributors have a direct say in how funds are utilized through our voting mechanism, creating a democratic approach to fundraising.
            </p>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Core Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaLock />
              </div>
              <h3 className="font-bold text-lg">Security & Trust</h3>
            </div>
            <p className="text-gray-600">
              We prioritize the security of funds and data. Our smart contracts are designed to be immutable and secure,
              ensuring that contributions are handled exactly as specified, with no possibility of fraud or misuse.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaBalanceScale />
              </div>
              <h3 className="font-bold text-lg">Fairness & Equality</h3>
            </div>
            <p className="text-gray-600">
              We believe in creating a level playing field where anyone can start a campaign or contribute to one,
              regardless of traditional barriers. Democratic voting ensures fair fund allocation.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaGlobe />
              </div>
              <h3 className="font-bold text-lg">Global Accessibility</h3>
            </div>
            <p className="text-gray-600">
              Our platform is accessible to anyone with an internet connection and a crypto wallet.
              We're breaking down geographical barriers to create a truly global fundraising ecosystem.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-xs p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4">
                <FaUsers />
              </div>
              <h3 className="font-bold text-lg">Community Empowerment</h3>
            </div>
            <p className="text-gray-600">
              We believe in the wisdom of the crowd. By giving contributors voting rights,
              we ensure that funds are used responsibly and in line with the campaign's original purpose.
            </p>
          </div>
        </div>
      </div>

      {/* Technology */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Technology</h2>
        <div className="bg-gray-50 rounded-lg p-8">
          <p className="text-gray-700 mb-4">
            LedgerVest is built on the Ethereum blockchain using Solidity smart contracts. Our architecture consists of:
          </p>

          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li><strong>Factory Contract:</strong> Deploys and tracks all campaign contracts.</li>
            <li><strong>Campaign Contracts:</strong> Individual contracts for each fundraising campaign.</li>
            <li><strong>Web3 Integration:</strong> Seamless connection to MetaMask and other Ethereum wallets.</li>
            <li><strong>Next.js Frontend:</strong> Modern, responsive user interface for easy interaction with the blockchain.</li>
          </ul>

          <p className="text-gray-700">
            All code is open-source and available for review, ensuring transparency not just in the transactions, but in the very code that powers our platform.
          </p>
        </div>
      </div>

      {/* Team - You can add this section with actual team members when available */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
        <p className="text-center text-gray-600 mb-8">
          We're a group of blockchain enthusiasts, developers, and finance professionals committed to revolutionizing fundraising through technology.
        </p>

        {/* Use Flexbox for centering */}
        <div className="flex flex-wrap justify-center gap-8"> {/* Changed from grid to flex */}

          {/* Team Member Card - Add width classes */}
          <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] bg-white rounded-lg shadow-xs p-6 text-center"> {/* Added width classes */}
            <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <Image
                src="/profile/yang.jpg"
                alt="Pin-Yang Chen profile picture"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="font-bold">Pin-Yang Chen</h3>
            <p className="text-blue-600">Full-Stack Developer & Blockchain Developer</p>
            <p className="text-gray-600 mt-2 text-sm">
              Love to dance but don't like to hit the gym
            </p>
          </div>

          {/* Team Member Card - Add width classes */}
          <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] bg-white rounded-lg shadow-xs p-6 text-center"> {/* Added width classes */}
            <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <Image
                src="/profile/howard.jpg"
                alt="Howard Wu profile picture"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="font-bold">Howard Wu</h3>
            <p className="text-blue-600">Backend Developer & DevOps</p>
            <p className="text-gray-600 mt-2 text-sm">
              Coding Newbie
            </p>
          </div>

          {/* Team Member Card - Add width classes */}
          <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] bg-white rounded-lg shadow-xs p-6 text-center"> {/* Added width classes */}
            <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <Image
                src="/profile/freddy.jpg"
                alt="Freddy Platinus profile picture"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="font-bold">Freddy Platinus</h3>
            <p className="text-blue-600">Project Manager</p>
            <p className="text-gray-600 mt-2 text-sm">
              Whatever
            </p>
          </div>

          {/* Team Member Card - Add width classes */}
          <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] bg-white rounded-lg shadow-xs p-6 text-center"> {/* Added width classes */}
            <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <Image
                src="/profile/junjie.jpg"
                alt="Junjie Li profile picture"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="font-bold">Junjie Li</h3>
            <p className="text-blue-600">Frontend Developer & UI/UX Designer</p>
            <p className="text-gray-600 mt-2 text-sm">
              First place in the 2024 FinTech Trading Competition
            </p>
          </div>

          {/* Team Member Card - Add width classes */}
          <div className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.34rem)] bg-white rounded-lg shadow-xs p-6 text-center"> {/* Added width classes */}
            <div className="relative w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden">
              <Image
                src="/profile/chris.jpg"
                alt="Chris Liu profile picture"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
              />
            </div>
            <h3 className="font-bold">Chris Liu</h3>
            <p className="text-blue-600">Frontend Developer</p>
            <p className="text-gray-600 mt-2 text-sm">
              Best Gambler in options market
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Be part of the decentralized fundraising revolution and help us build a more transparent future.
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
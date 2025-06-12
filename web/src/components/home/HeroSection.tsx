import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';

interface HeroSectionProps {
  isConnected: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isConnected }) => {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
              Secure Investments Through Blockchain Technology
            </h1>
            <p className="text-xl mb-8 max-w-xl">
              A transparent, fair, and decentralized investment and lending platform ensuring trust
              and security between investors and borrowing companies.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/projects"
                className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors focus:ring focus:ring-blue-200"
              >
                Get Started
              </Link>
              <Link
                href="#how-it-works"
                className="bg-transparent hover:bg-blue-500 border border-white px-6 py-3 rounded-lg font-semibold transition-colors focus:ring focus:ring-blue-200"
              >
                Learn More
              </Link>
              {isConnected && (
                <Link
                  href="/dashboard"
                  className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center focus:ring focus:ring-green-200"
                  aria-label="Go to My Dashboard"
                >
                  <FaUserCircle className="mr-2" /> My Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="/HeroSection.png"
              alt="Hero Image"
              width={900}
              height={400}
              className="w-auto h-full rounded-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

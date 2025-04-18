// filepath: /home/halcyon/root/fintech512-project_ledgervest/web/src/components/layout/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Remove WalletContext if no longer needed elsewhere
// import { useWallet } from '@/lib/context/WalletContext'; 
// Remove WalletButton import
// import WalletButton from '../ui/WalletButton'; 
import { FaLink, FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
// Remove LoginButton import
// import LoginButton from '../LoginButton'; 
import UserWalletButton from '../ui/WalletButton'; // Import the new button

// ... (rest of the Navbar component remains the same until the button section)

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Remove useWallet if not used
  // const { walletAddress, connectWallet, disconnectWallet } = useWallet(); 

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Create', href: '/create' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Branding */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <FaLink className="h-8 w-8 text-blue-400" />
              <span className="font-bold text-xl">LedgerVest</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <ul className="flex space-x-4 mr-4">
              {navLinks.map((link) => (
                <li key={link.name} className="flex items-center">
                  <Link 
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === link.href 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Replace WalletButton and LoginButton with UserWalletButton */}
            <UserWalletButton /> 
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
             {/* Also add UserWalletButton for mobile if needed, or keep separate */}
             <div className="mr-2"> <UserWalletButton /> </div>
            <button
              type="button"
              className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
              >
                {link.name}
              </Link>
            ))}
             {/* Optionally add UserWalletButton actions here for mobile if not placed above */}
          </div>
        </div>
      )}
    </nav>
  );
}
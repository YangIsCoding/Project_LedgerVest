// src/components/layout/Footer.tsx
import Link from 'next/link';
import { FaTwitter, FaLinkedin, FaGithub, FaTelegram } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h5 className="font-bold text-lg mb-4">LedgerVest</h5>
            <p className="text-gray-300">
              A decentralized investment and lending platform ensuring trust and security 
              between investors and borrowing companies.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-4">Connect With Us</h5>
            <div className="flex space-x-4">
        
              <a href="https://github.com/YangIsCoding" className="text-gray-300 hover:text-white">
                <FaGithub size={24} />
              </a>
             
            </div>
          </div>
        </div>
        
        <hr className="border-gray-700 my-6" />
        
        <div className="text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} LedgerVest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
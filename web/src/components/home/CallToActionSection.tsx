import React from 'react';
import Link from 'next/link';

interface CallToActionSectionProps {
  // You can define props here if needed
}

const CallToActionSection: React.FC<CallToActionSectionProps> = () => {
  return (
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
  );
};

export default CallToActionSection;
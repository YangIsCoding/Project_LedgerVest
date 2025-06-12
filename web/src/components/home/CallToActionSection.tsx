import React from 'react';
import Link from 'next/link';

interface CallToActionSectionProps {
  className?: string; // 可選，讓父層可以覆寫 className
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ className = '' }) => {
  return (
    <section className={`py-20 bg-blue-600 text-white ${className}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Investing?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Join our platform today and discover new investment opportunities.
        </p>
        <Link
          href="/projects"
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 inline-block shadow hover:shadow-md"
        >
          Browse Projects
        </Link>
      </div>
    </section>
  );
};

export default CallToActionSection;

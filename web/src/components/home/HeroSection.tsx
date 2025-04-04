import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
interface HeroSectionProps {
    // You can define props here if needed
}
const HeroSection: React.FC<HeroSectionProps> = () => {
    return (
        <section className="bg-blue-600 text-white py-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                            Secure Investments Through Blockchain Technology
                        </h1>
                        <p className="text-xl mb-8">
                            A transparent, fair, and decentralized investment and lending platform ensuring trust
                            and security between investors and borrowing companies.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/projects" className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
                                Get Started
                            </Link>
                            <Link href="#how-it-works" className="bg-transparent hover:bg-blue-500 border border-white px-6 py-3 rounded-lg font-semibold transition-colors">
                                Learn More
                            </Link>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <Image
                            src="/images/hero-image.svg"
                            alt="Blockchain Investment"
                            width={600}
                            height={400}
                            className="w-full h-auto"
                            priority
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
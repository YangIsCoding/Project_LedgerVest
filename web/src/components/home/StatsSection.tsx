import React from 'react';
import { FaUsers, FaProjectDiagram, FaCoins } from 'react-icons/fa';

interface StatsSectionProps {
    // You can define props here if needed
}

const StatsSection: React.FC<StatsSectionProps> = () => {
    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <FaUsers className="text-5xl text-blue-600 mb-4 mx-auto" />
                        <h3 className="text-3xl font-bold">500+</h3>
                        <p className="text-gray-600">Active Investors</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <FaProjectDiagram className="text-5xl text-blue-600 mb-4 mx-auto" />
                        <h3 className="text-3xl font-bold">100+</h3>
                        <p className="text-gray-600">Funded Projects</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <FaCoins className="text-5xl text-blue-600 mb-4 mx-auto" />
                        <h3 className="text-3xl font-bold">$10M+</h3>
                        <p className="text-gray-600">Total Investments</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
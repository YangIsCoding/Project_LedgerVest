// src/app/projects/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useWallet } from '@/lib/context/WalletContext';
import { MOCK_PROJECTS } from '@/lib/utils/mockData';
import { FaFilter, FaSort } from 'react-icons/fa';

export default function ProjectsPage() {
  const { isConnected } = useWallet();
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Investment Opportunities</h1>
        <div className="flex space-x-2">
          <button 
            className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
          
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              <FaSort className="mr-2" />
              Sort
            </button>
          </div>
        </div>
      </div>
      
      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 flex justify-between items-start">
              <span className={`${getCategoryColor(project.category)} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
                {project.category}
              </span>
              <span className={`${project.hasCollateral ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
                {project.hasCollateral ? 'With Collateral' : 'No Collateral'}
              </span>
            </div>
            
            <div className="p-4 pt-0">
              <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
              <p className="text-gray-500 text-sm mb-3">by {project.company}</p>
              
              <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                {project.description}
              </p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span>{Math.round((project.raised / project.target) * 100)}% funded</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.round((project.raised / project.target) * 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="border rounded p-2 text-center">
                  <div className="text-xs text-gray-500">Target</div>
                  <div className="font-semibold">${project.target.toLocaleString()}</div>
                </div>
                <div className="border rounded p-2 text-center">
                  <div className="text-xs text-gray-500">Interest</div>
                  <div className="font-semibold">{project.interestRate}%</div>
                </div>
                <div className="border rounded p-2 text-center">
                  <div className="text-xs text-gray-500">Term</div>
                  <div className="font-semibold">{project.term} mo</div>
                </div>
              </div>
            </div>
            
            <div className="border-t px-4 py-3 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {project.daysLeft} days left
              </div>
              <Link
                href={`/project/${project.id}`}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-gray-500">Check back later for new investment opportunities.</p>
        </div>
      )}
    </div>
  );
}

// Helper function to get category color
function getCategoryColor(category: string): string {
  const categoryColors: { [key: string]: string } = {
    'Technology': 'bg-blue-600',
    'Real Estate': 'bg-yellow-500',
    'Energy': 'bg-red-600',
    'Healthcare': 'bg-cyan-500',
    'Education': 'bg-gray-600',
    'Finance': 'bg-green-600',
    'Agriculture': 'bg-green-500'
  };
  
  return categoryColors[category] || 'bg-purple-500';
}
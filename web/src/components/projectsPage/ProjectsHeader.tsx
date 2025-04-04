import React from 'react';
import Link from 'next/link';
import { FaFilter, FaSort } from 'react-icons/fa';

interface ProjectsHeaderProps {
  isConnected: boolean;
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

export default function ProjectsHeader({ isConnected, isFilterOpen, setIsFilterOpen }: ProjectsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold">Investment Opportunities</h1>
      <div className="flex space-x-2">
        {isConnected && (
          <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center mr-2">
            Create Campaign
          </Link>
        )}
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
  );
}
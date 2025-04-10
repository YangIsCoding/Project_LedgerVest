import React from 'react';
import Link from 'next/link';
import { FaUserShield, FaPlusCircle, FaProjectDiagram } from 'react-icons/fa';

interface AdminActionsProps {
  account: string;
}

export default function AdminActions({ account }: AdminActionsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="border-b p-4">
        <h2 className="text-xl font-bold flex items-center">
          <FaUserShield className="mr-2 text-blue-600" /> Admin Actions
        </h2>
      </div>
      <div className="p-4 space-y-3">
        <Link href="/create" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center w-full">
          <FaPlusCircle className="mr-2" /> Create New Campaign
        </Link>
        <Link href="/projects" className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 flex items-center justify-center w-full">
          <FaProjectDiagram className="mr-2" /> View All Projects
        </Link>
        <hr className="my-3" />
      </div>
    </div>
  );
}
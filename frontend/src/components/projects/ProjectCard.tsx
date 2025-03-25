// src/components/projects/ProjectCard.tsx
import Link from 'next/link';
import { FC } from 'react';

interface ProjectCardProps {
  id: string;
  title: string;
  company: string;
  category: string;
  description: string;
  target: number;
  raised: number;
  interestRate: number;
  term: number;
  daysLeft: number;
  hasCollateral: boolean;
}

const ProjectCard: FC<ProjectCardProps> = ({
  id,
  title,
  company,
  category,
  description,
  target,
  raised,
  interestRate,
  term,
  daysLeft,
  hasCollateral
}) => {
  // Calculate progress percentage
  const progress = Math.min(Math.round((raised / target) * 100), 100);
  
  // Category background colors
  const categoryColors: { [key: string]: string } = {
    technology: 'bg-blue-600',
    real_estate: 'bg-yellow-500',
    energy: 'bg-red-600',
    healthcare: 'bg-cyan-500',
    education: 'bg-gray-600',
    finance: 'bg-green-600',
    agriculture: 'bg-green-500',
    other: 'bg-purple-500'
  };
  
  const bgColor = categoryColors[category.toLowerCase().replace(' ', '_')] || 'bg-gray-600';
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex justify-between items-start">
        <span className={`${bgColor} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
          {category}
        </span>
        <span className={`${hasCollateral ? 'bg-green-500' : 'bg-gray-500'} text-white text-xs font-semibold px-2.5 py-0.5 rounded`}>
          {hasCollateral ? 'With Collateral' : 'No Collateral'}
        </span>
      </div>
      
      <div className="p-4 pt-0">
        <h3 className="text-xl font-semibold mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-3">by {company}</p>
        
        <p className="text-gray-700 mb-4 text-sm line-clamp-3">
          {description}
        </p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Progress</span>
            <span>{progress}% funded</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-green-600 h-2.5 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="border rounded p-2 text-center">
            <div className="text-xs text-gray-500">Target</div>
            <div className="font-semibold">${target.toLocaleString()}</div>
          </div>
          <div className="border rounded p-2 text-center">
            <div className="text-xs text-gray-500">Interest</div>
            <div className="font-semibold">{interestRate}%</div>
          </div>
          <div className="border rounded p-2 text-center">
            <div className="text-xs text-gray-500">Term</div>
            <div className="font-semibold">{term} mo</div>
          </div>
        </div>
      </div>
      
      <div className="border-t px-4 py-3 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {daysLeft} days left
        </div>
        <Link
          href={`/project/${id}`}
          className="text-sm bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-md transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
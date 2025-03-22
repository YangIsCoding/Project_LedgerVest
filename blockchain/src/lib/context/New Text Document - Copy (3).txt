// src/lib/utils/mockData.ts

// Project data structure
export interface Project {
  id: string;
  title: string;
  company: string;
  companyAddress: string;
  category: string;
  description: string;
  target: number;
  raised: number;
  interestRate: number;
  term: number; // In months
  daysLeft: number;
  hasCollateral: boolean;
  collateralType?: string;
  collateralValue?: number;
  createdAt: Date;
  status: 'active' | 'funded' | 'completed' | 'failed';
  investors: number;
}

// Withdrawal request data structure
export interface WithdrawalRequest {
  id: string;
  projectId: string;
  amount: number;
  purpose: string;
  supportingDocuments: string[];
  approvalCount: number;
  rejectionCount: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  expiresAt: Date;
}

// Investment data structure
export interface Investment {
  id: string;
  projectId: string;
  investorAddress: string;
  amount: number;
  timestamp: Date;
  returns: number;
  status: 'active' | 'completed';
}

// Mock projects data
export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Smart Agriculture System',
    company: 'Green Tech Solutions',
    companyAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    category: 'Technology',
    description: 'Developing an AI-powered irrigation and crop monitoring system for sustainable farming practices, helping farmers optimize resource usage and increase crop yields. The system uses IoT sensors, machine learning algorithms, and mobile applications to provide real-time insights and automated controls.',
    target: 150000,
    raised: 97500,
    interestRate: 8.5,
    term: 18,
    daysLeft: 21,
    hasCollateral: true,
    collateralType: 'Equipment',
    collateralValue: 75000,
    createdAt: new Date('2025-02-15'),
    status: 'active',
    investors: 14
  },
  {
    id: '2',
    title: 'Eco-Friendly Apartment Complex',
    company: 'Sustainable Homes Inc.',
    companyAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    category: 'Real Estate',
    description: 'Construction of a sustainable apartment complex with solar panels, rainwater harvesting, and green spaces in an urban area, promoting eco-friendly living. The project includes 24 units with advanced energy-efficient appliances, shared electric vehicle charging stations, and community gardens.',
    target: 500000,
    raised: 390000,
    interestRate: 7.2,
    term: 36,
    daysLeft: 14,
    hasCollateral: true,
    collateralType: 'Real Estate',
    collateralValue: 350000,
    createdAt: new Date('2025-02-20'),
    status: 'active',
    investors: 28
  },
  {
    id: '3',
    title: 'Advanced Medical Diagnostic Tool',
    company: 'MediTech Solutions',
    companyAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    category: 'Healthcare',
    description: 'Development of an AI-powered diagnostic tool to help identify early-stage diseases through image analysis, improving healthcare outcomes worldwide. The platform will be trained on anonymized medical imaging data and validated through clinical trials to ensure accuracy and reliability.',
    target: 250000,
    raised: 112500,
    interestRate: 9.5,
    term: 24,
    daysLeft: 30,
    hasCollateral: false,
    createdAt: new Date('2025-03-01'),
    status: 'active',
    investors: 9
  },
  {
    id: '4',
    title: 'Solar Farm Expansion Project',
    company: 'SunPower Energy',
    companyAddress: '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    category: 'Energy',
    description: 'Expansion of an existing solar farm to increase clean energy production capacity in rural communities, reducing reliance on fossil fuels. The expansion will add 5MW of solar capacity, enough to power approximately 1,000 homes, and includes battery storage systems for enhanced grid stability.',
    target: 420000,
    raised: 386400,
    interestRate: 6.8,
    term: 48,
    daysLeft: 7,
    hasCollateral: true,
    collateralType: 'Equipment',
    collateralValue: 250000,
    createdAt: new Date('2025-02-10'),
    status: 'active',
    investors: 32
  },
  {
    id: '5',
    title: 'Interactive Learning Platform',
    company: 'EduTech Innovations',
    companyAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    category: 'Education',
    description: 'Development of an interactive online learning platform with AI-powered personalized learning paths for students of all ages. The platform adapts to individual learning styles, provides instant feedback, and includes gamified elements to increase engagement and knowledge retention.',
    target: 180000,
    raised: 68400,
    interestRate: 8.0,
    term: 24,
    daysLeft: 25,
    hasCollateral: false,
    createdAt: new Date('2025-02-25'),
    status: 'active',
    investors: 12
  },
  {
    id: '6',
    title: 'Vertical Farming Facility',
    company: 'Urban Harvest',
    companyAddress: '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    category: 'Agriculture',
    description: 'Construction of a vertical farming facility in urban areas to provide fresh, locally grown produce year-round with minimal environmental impact. The facility will use hydroponics, LED lighting, and automated systems to grow leafy greens and herbs with 95% less water than traditional farming.',
    target: 320000,
    raised: 176000,
    interestRate: 7.5,
    term: 30,
    daysLeft: 18,
    hasCollateral: true,
    collateralType: 'Equipment',
    collateralValue: 160000,
    createdAt: new Date('2025-02-18'),
    status: 'active',
    investors: 19
  }
];

// Mock withdrawal requests
export const MOCK_WITHDRAWAL_REQUESTS: WithdrawalRequest[] = [
  {
    id: '1',
    projectId: '1',
    amount: 25000,
    purpose: 'Purchase hardware components for prototype development, including sensors, microcontrollers, and actuators',
    supportingDocuments: ['invoice_hardware.pdf', 'vendor_quote.pdf'],
    approvalCount: 8,
    rejectionCount: 2,
    status: 'pending',
    createdAt: new Date('2025-03-18'),
    expiresAt: new Date('2025-03-25')
  },
  {
    id: '2',
    projectId: '3',
    amount: 40000,
    purpose: 'Hire specialized AI engineers for algorithm development and procure medical imaging datasets for training',
    supportingDocuments: ['contract_draft.pdf', 'dataset_license.pdf'],
    approvalCount: 5,
    rejectionCount: 1,
    status: 'pending',
    createdAt: new Date('2025-03-15'),
    expiresAt: new Date('2025-03-25')
  },
  {
    id: '3',
    projectId: '2',
    amount: 100000,
    purpose: 'Land acquisition payment for the apartment complex site (first installment)',
    supportingDocuments: ['purchase_agreement.pdf', 'land_survey.pdf'],
    approvalCount: 21,
    rejectionCount: 3,
    status: 'approved',
    createdAt: new Date('2025-03-03'),
    expiresAt: new Date('2025-03-10')
  }
];

// Mock user investments
export const MOCK_USER_INVESTMENTS: Investment[] = [
  {
    id: '1',
    projectId: '4',
    investorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 5000,
    timestamp: new Date('2025-02-20'),
    returns: 340,
    status: 'active'
  },
  {
    id: '2',
    projectId: '2',
    investorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 7500,
    timestamp: new Date('2025-02-25'),
    returns: 180,
    status: 'active'
  },
  {
    id: '3',
    projectId: '3',
    investorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 4000,
    timestamp: new Date('2025-03-05'),
    returns: 0,
    status: 'active'
  },
  {
    id: '4',
    projectId: '5',
    investorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 2500,
    timestamp: new Date('2025-03-01'),
    returns: 50,
    status: 'active'
  },
  {
    id: '5',
    projectId: '1',
    investorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 2000,
    timestamp: new Date('2025-02-28'),
    returns: 85,
    status: 'active'
  },
  {
    id: '6',
    projectId: '6',
    investorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    amount: 3500,
    timestamp: new Date('2025-03-10'),
    returns: 65,
    status: 'active'
  }
];

// Helper function to get project by ID
export function getProjectById(id: string): Project | undefined {
  return MOCK_PROJECTS.find(project => project.id === id);
}

// Helper function to get user's investments
export function getUserInvestments(address: string): Investment[] {
  return MOCK_USER_INVESTMENTS.filter(
    investment => investment.investorAddress.toLowerCase() === address.toLowerCase()
  );
}

// Helper function to get total invested amount
export function getTotalInvestedAmount(address: string): number {
  return getUserInvestments(address).reduce(
    (total, investment) => total + investment.amount, 
    0
  );
}

// Helper function to get total returns
export function getTotalReturns(address: string): number {
  return getUserInvestments(address).reduce(
    (total, investment) => total + investment.returns, 
    0
  );
}

// Helper function to get withdrawal requests for a project
export function getProjectWithdrawalRequests(projectId: string): WithdrawalRequest[] {
  return MOCK_WITHDRAWAL_REQUESTS.filter(
    request => request.projectId === projectId
  );
}
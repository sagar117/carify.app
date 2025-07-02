import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3,
  FilePlus
} from 'lucide-react';
import BenefitsSummary from '../components/benefits/BenefitsSummary';
import RecentCallsList from '../components/calls/RecentCallsList';
import StatusCard from '../components/ui/StatusCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock data
  const stats = [
    { 
      title: 'Successful Calls', 
      value: 27, 
      change: '+12%', 
      changeType: 'positive',
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />
    },
    { 
      title: 'Failed Calls', 
      value: 3, 
      change: '-2%', 
      changeType: 'positive',
      icon: <AlertTriangle className="h-6 w-6 text-amber-500" />
    },
    { 
      title: 'Average Call Time', 
      value: '4m 12s', 
      change: '-28s', 
      changeType: 'positive',
      icon: <Clock className="h-6 w-6 text-sky-500" />
    },
    { 
      title: 'Total Benefits Retrieved', 
      value: 20, 
      change: '+24%', 
      changeType: 'positive',
      icon: <BarChart3 className="h-6 w-6 text-purple-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-3 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => navigate('/new-call')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            <Phone className="mr-2 h-4 w-4" />
            New Call
          </button>
          <button 
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            <FilePlus className="mr-2 h-4 w-4" />
            Import Data
          </button>
        </div>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatusCard key={index} {...stat} />
        ))}
      </div>
      
      {/* Recent benefits and calls */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BenefitsSummary />
        <RecentCallsList />
      </div>
    </div>
  );
};

export default Dashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Clock, CheckCircle, XCircle } from 'lucide-react';

// Mock data
const callsData = [
  {
    id: '1',
    phoneNumber: '+1 (800) 123-4567',
    provider: 'Blue Cross Blue Shield',
    status: 'completed',
    duration: '4:32',
    timestamp: '2025-04-12T14:30:00',
    benefitsId: '1'
  },
  {
    id: '2',
    phoneNumber: '+1 (888) 234-5678',
    provider: 'Aetna',
    status: 'completed',
    duration: '3:45',
    timestamp: '2025-04-10T11:15:00',
    benefitsId: '2'
  },
  {
    id: '3',
    phoneNumber: '+1 (877) 345-6789',
    provider: 'UnitedHealthcare',
    status: 'failed',
    duration: '1:20',
    timestamp: '2025-04-09T09:45:00',
    benefitsId: null
  },
  {
    id: '4',
    phoneNumber: '+1 (866) 456-7890',
    provider: 'Cigna',
    status: 'in_progress',
    duration: '-',
    timestamp: '2025-04-13T10:00:00',
    benefitsId: null
  }
];

const RecentCallsList: React.FC = () => {
  const navigate = useNavigate();
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" /> Failed
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="mr-1 h-3 w-3 animate-spin" /> In Progress
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Calls</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Latest outbound calls to insurance providers
        </p>
      </div>
      <ul className="divide-y divide-gray-200">
        {callsData.map((call) => (
          <li key={call.id}>
            <div 
              className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => {
                if (call.benefitsId) {
                  navigate(`/benefits/${call.benefitsId}`);
                } else if (call.status === 'in_progress') {
                  // Do nothing or show toast that call is in progress
                } else {
                  navigate(`/call-history`);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-sky-600 truncate">
                  {call.provider}
                </p>
                <div className="ml-2 flex-shrink-0">
                  {getStatusBadge(call.status)}
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                    {call.phoneNumber}
                  </p>
                  {call.duration !== '-' && (
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {call.duration}
                    </p>
                  )}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <p>{formatTime(call.timestamp)}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center">
        <button 
          onClick={() => navigate('/call-history')}
          className="text-sm font-medium text-sky-600 hover:text-sky-500"
        >
          View all calls
        </button>
      </div>
    </div>
  );
};

export default RecentCallsList;
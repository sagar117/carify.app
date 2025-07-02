import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search,
  Download,
  Building
} from 'lucide-react';
import { format } from 'date-fns';

// Mock data
const callsData = [
  {
    id: '1',
    phoneNumber: '+1 (800) 123-4567',
    provider: 'Blue Cross Blue Shield',
    status: 'completed',
    duration: '4:32',
    timestamp: '2025-04-12T14:30:00',
    benefitsId: '1',
    patientName: 'John Smith'
  },
  {
    id: '2',
    phoneNumber: '+1 (888) 234-5678',
    provider: 'Aetna',
    status: 'completed',
    duration: '3:45',
    timestamp: '2025-04-10T11:15:00',
    benefitsId: '2',
    patientName: 'Sarah Johnson'
  },
  {
    id: '3',
    phoneNumber: '+1 (877) 345-6789',
    provider: 'UnitedHealthcare',
    status: 'failed',
    duration: '1:20',
    timestamp: '2025-04-09T09:45:00',
    benefitsId: null,
    patientName: 'Michael Brown'
  },
  {
    id: '4',
    phoneNumber: '+1 (866) 456-7890',
    provider: 'Cigna',
    status: 'in_progress',
    duration: '-',
    timestamp: '2025-04-13T10:00:00',
    benefitsId: null,
    patientName: 'Emma Wilson'
  },
  {
    id: '5',
    phoneNumber: '+1 (855) 567-8901',
    provider: 'Humana',
    status: 'completed',
    duration: '5:12',
    timestamp: '2025-04-08T15:20:00',
    benefitsId: '3',
    patientName: 'David Lee'
  },
  {
    id: '6',
    phoneNumber: '+1 (844) 678-9012',
    provider: 'Kaiser Permanente',
    status: 'failed',
    duration: '0:45',
    timestamp: '2025-04-07T13:10:00',
    benefitsId: null,
    patientName: 'Jennifer Adams'
  },
  {
    id: '7',
    phoneNumber: '+1 (833) 789-0123',
    provider: 'Medicare',
    status: 'completed',
    duration: '6:05',
    timestamp: '2025-04-05T09:30:00',
    benefitsId: '4',
    patientName: 'Robert Garcia'
  }
];

type CallStatus = 'all' | 'completed' | 'failed' | 'in_progress';

const CallHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<CallStatus>('all');
  
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
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return format(date, 'MMM d, yyyy h:mm a');
  };
  
  const filteredCalls = callsData
    .filter(call => {
      if (statusFilter === 'all') return true;
      return call.status === statusFilter;
    })
    .filter(call => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        call.provider.toLowerCase().includes(searchLower) ||
        call.phoneNumber.toLowerCase().includes(searchLower) ||
        call.patientName.toLowerCase().includes(searchLower)
      );
    });
    
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Call History</h1>
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
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Search and filter */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by provider, phone number, or patient"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="sr-only">Status</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="status"
                className="focus:ring-sky-500 focus:border-sky-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as CallStatus)}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-sm text-gray-500">
              Showing {filteredCalls.length} of {callsData.length} calls
            </span>
          </div>
        </div>
      </div>
      
      {/* Calls list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredCalls.length > 0 ? (
            filteredCalls.map((call) => (
              <li key={call.id}>
                <div 
                  className="block hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    if (call.benefitsId) {
                      navigate(`/benefits/${call.benefitsId}`);
                    } else if (call.status === 'in_progress') {
                      // Do nothing or show toast that call is in progress
                    } else {
                      // Do nothing, it's a failed call with no benefits
                    }
                  }}
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-2" />
                        <p className="text-sm font-medium text-sky-600 truncate">
                          {call.provider}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        {getStatusBadge(call.status)}
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex sm:space-x-6">
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <Phone className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {call.phoneNumber}
                        </div>
                        {call.duration !== '-' && (
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {call.duration}
                          </div>
                        )}
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          {call.patientName}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {formatTime(call.timestamp)}
                      </div>
                    </div>
                    {call.status === 'completed' && call.benefitsId && (
                      <div className="mt-2">
                        <span className="text-xs text-sky-600 hover:text-sky-800">
                          View benefits details →
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="py-12">
              <div className="text-center">
                <Search className="mx-auto h-12 w-12 text-gray-300" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No matching calls</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CallHistory;
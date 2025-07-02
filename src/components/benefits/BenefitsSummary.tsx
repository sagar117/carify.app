import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, DollarSign, Heart, Wallet } from 'lucide-react';

// Mock data
const benefitsData = [
  {
    id: '1',
    patientName: 'John Smith',
    insuranceProvider: 'Blue Cross',
    memberId: 'BC123456789',
    callDate: '2025-04-12',
    benefits: {
      copay: { primary: '$20', specialist: '$35' },
      deductible: { individual: '$1,500', family: '$3,000' },
      coinsurance: '20%',
      outOfPocket: { individual: '$5,000', family: '$10,000' }
    }
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    insuranceProvider: 'Aetna',
    memberId: 'AET987654321',
    callDate: '2025-04-10',
    benefits: {
      copay: { primary: '$25', specialist: '$45' },
      deductible: { individual: '$2,000', family: '$4,000' },
      coinsurance: '15%',
      outOfPocket: { individual: '$6,000', family: '$12,000' }
    }
  }
];

const BenefitsSummary: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Recent Benefits</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Latest insurance benefits information retrieved
        </p>
      </div>
      <div className="divide-y divide-gray-200">
        {benefitsData.map((item) => (
          <div 
            key={item.id}
            className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => navigate(`/benefits/${item.id}`)}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-sky-600 truncate">{item.patientName}</p>
              <div className="ml-2 flex-shrink-0 flex">
                <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Complete
                </p>
              </div>
            </div>
            <div className="mt-2 sm:flex sm:justify-between">
              <div className="sm:flex">
                <p className="flex items-center text-sm text-gray-500">
                  {item.insuranceProvider}
                </p>
                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  ID: {item.memberId}
                </p>
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <p>
                  Called on {item.callDate}
                </p>
              </div>
            </div>
            
            {/* Benefits overview */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                <span>Copay: {item.benefits.copay.primary}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                <span>Deductible: {item.benefits.deductible.individual}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Heart className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                <span>Coinsurance: {item.benefits.coinsurance}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Wallet className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                <span>Out-of-pocket: {item.benefits.outOfPocket.individual}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-50 px-4 py-4 sm:px-6 text-center">
        <button 
          onClick={() => navigate('/call-history')}
          className="text-sm font-medium text-sky-600 hover:text-sky-500"
        >
          View all benefits
        </button>
      </div>
    </div>
  );
};

export default BenefitsSummary;
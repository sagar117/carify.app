import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Clock, 
  Download, 
  Printer, 
  Phone, 
  Building, 
  User, 
  CalendarDays,
  Shield,
  DollarSign,
  Percent,
  Wallet
} from 'lucide-react';

// Mock data
const benefitsData = {
  '1': {
    id: '1',
    patientName: 'John Smith',
    patientDOB: '1980-05-15',
    insuranceProvider: 'Blue Cross Blue Shield',
    insurancePhone: '+1 (800) 123-4567',
    memberId: 'BC123456789',
    groupNumber: 'GRP7890',
    callDate: '2025-04-12T14:30:00',
    callDuration: '4:32',
    benefits: {
      copay: { 
        primary: '$20', 
        specialist: '$35', 
        urgentCare: '$50', 
        emergency: '$250'
      },
      deductible: { 
        individual: '$1,500', 
        family: '$3,000',
        status: '$500 met',
        network: 'In-Network'
      },
      coinsurance: {
        percentage: '20%',
        afterDeductible: true,
        preventiveCare: '0%'
      },
      outOfPocket: { 
        individual: '$5,000', 
        family: '$10,000',
        status: '$1,200 met'
      },
      additionalInfo: {
        preAuth: 'Required for inpatient services, imaging, and certain procedures',
        referrals: 'Not required for specialists',
        planYear: 'January 1 - December 31'
      }
    }
  },
  '2': {
    id: '2',
    patientName: 'Sarah Johnson',
    patientDOB: '1975-08-22',
    insuranceProvider: 'Aetna',
    insurancePhone: '+1 (888) 234-5678',
    memberId: 'AET987654321',
    groupNumber: 'ATN5678',
    callDate: '2025-04-10T11:15:00',
    callDuration: '3:45',
    benefits: {
      copay: { 
        primary: '$25', 
        specialist: '$45', 
        urgentCare: '$60', 
        emergency: '$300'
      },
      deductible: { 
        individual: '$2,000', 
        family: '$4,000',
        status: '$750 met',
        network: 'In-Network'
      },
      coinsurance: {
        percentage: '15%',
        afterDeductible: true,
        preventiveCare: '0%'
      },
      outOfPocket: { 
        individual: '$6,000', 
        family: '$12,000',
        status: '$1,500 met'
      },
      additionalInfo: {
        preAuth: 'Required for all hospital admissions and outpatient surgeries',
        referrals: 'Required for specialists',
        planYear: 'July 1 - June 30'
      }
    }
  }
};

const BenefitsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get benefits data based on ID
  const benefitsInfo = id ? benefitsData[id as keyof typeof benefitsData] : null;
  
  if (!benefitsInfo) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700">Benefits information not found</h2>
        <p className="mt-2 text-gray-500">The requested benefits data could not be located.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Insurance Benefits Details</h1>
            <p className="text-sm text-gray-500">
              Call completed on {formatDate(benefitsInfo.callDate)}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`inline-flex items-center px-3 py-1.5 border ${
              isEditing 
                ? 'border-sky-600 text-sky-600 bg-sky-50' 
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            } text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors`}
          >
            <Edit className="mr-1.5 h-4 w-4" />
            {isEditing ? 'Cancel Editing' : 'Edit Benefits'}
          </button>
          
          <button
            onClick={() => {}}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            <Printer className="mr-1.5 h-4 w-4" />
            Print
          </button>
          
          <button
            onClick={() => {}}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-white bg-sky-600 hover:bg-sky-700 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export PDF
          </button>
        </div>
      </div>
      
      {/* Patient & Insurance Info */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Patient & Insurance Information</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <User className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Patient Name</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{benefitsInfo.patientName}</div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Date of Birth</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{benefitsInfo.patientDOB}</div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Building className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Insurance Provider</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{benefitsInfo.insuranceProvider}</div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Provider Phone</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{benefitsInfo.insurancePhone}</div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Member ID</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{benefitsInfo.memberId}</div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Group Number</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{benefitsInfo.groupNumber}</div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Call Date & Time</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{formatDate(benefitsInfo.callDate)}</div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm font-medium text-gray-500">Call Duration</span>
              </div>
              <div className="mt-1 text-sm text-gray-900">{benefitsInfo.callDuration}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Benefits Information */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Benefits Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Retrieved by voice agent on {formatDate(benefitsInfo.callDate)}
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-8">
            {/* Copays Section */}
            <div>
              <div className="flex items-center mb-4">
                <DollarSign className="h-6 w-6 text-emerald-500 mr-2" />
                <h4 className="text-lg font-medium text-gray-900">Copays</h4>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Primary Care</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.copay.primary}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.copay.primary}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Specialist</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.copay.specialist}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.copay.specialist}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Urgent Care</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.copay.urgentCare}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.copay.urgentCare}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Emergency</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.copay.emergency}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.copay.emergency}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Deductible Section */}
            <div>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 text-blue-500 mr-2" />
                <h4 className="text-lg font-medium text-gray-900">Deductible</h4>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Individual</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.deductible.individual}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.deductible.individual}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Family</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.deductible.family}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.deductible.family}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Status</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.deductible.status}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.deductible.status}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Network</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.deductible.network}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.deductible.network}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coinsurance Section */}
            <div>
              <div className="flex items-center mb-4">
                <Percent className="h-6 w-6 text-purple-500 mr-2" />
                <h4 className="text-lg font-medium text-gray-900">Coinsurance</h4>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Percentage</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.coinsurance.percentage}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.coinsurance.percentage}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">After Deductible?</span>
                    {isEditing ? (
                      <select 
                        defaultValue={benefitsInfo.benefits.coinsurance.afterDeductible ? "true" : "false"}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">
                        {benefitsInfo.benefits.coinsurance.afterDeductible ? "Yes" : "No"}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Preventive Care</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.coinsurance.preventiveCare}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.coinsurance.preventiveCare}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Out-of-Pocket Section */}
            <div>
              <div className="flex items-center mb-4">
                <Wallet className="h-6 w-6 text-amber-500 mr-2" />
                <h4 className="text-lg font-medium text-gray-900">Out-of-Pocket Maximum</h4>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Individual</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.outOfPocket.individual}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.outOfPocket.individual}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Family</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.outOfPocket.family}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.outOfPocket.family}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Status</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.outOfPocket.status}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-lg font-bold text-gray-900">{benefitsInfo.benefits.outOfPocket.status}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Additional Information */}
            <div>
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-gray-500 mr-2" />
                <h4 className="text-lg font-medium text-gray-900">Additional Information</h4>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Pre-Authorization</span>
                    {isEditing ? (
                      <textarea 
                        defaultValue={benefitsInfo.benefits.additionalInfo.preAuth}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                        rows={2}
                      />
                    ) : (
                      <span className="block mt-1 text-sm text-gray-900">{benefitsInfo.benefits.additionalInfo.preAuth}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Referrals</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.additionalInfo.referrals}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-sm text-gray-900">{benefitsInfo.benefits.additionalInfo.referrals}</span>
                    )}
                  </div>
                  
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Plan Year</span>
                    {isEditing ? (
                      <input 
                        type="text" 
                        defaultValue={benefitsInfo.benefits.additionalInfo.planYear}
                        className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="block mt-1 text-sm text-gray-900">{benefitsInfo.benefits.additionalInfo.planYear}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsEditing(false)}
                className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle save logic here
                  setIsEditing(false);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BenefitsDetail;
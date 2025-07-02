import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Phone, User, Calendar, CreditCard, Building, AlertCircle, Settings } from 'lucide-react';
import { callService } from '../services/api/callService';
import { settingsService } from '../services/settingsService';

interface FormData {
  patientName: string;
  patientDOB: string;
  phoneNumber: string;
  memberId: string;
}

const NewCall: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  useEffect(() => {
    setIsConfigured(settingsService.isTwilioConfigured());
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      console.log('Form submitted with data:', data);

      // Check if Twilio is configured
      if (!settingsService.isTwilioConfigured()) {
        toast.error('Please configure Twilio settings first');
        return;
      }

      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(data.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        toast.error('Please enter a valid phone number');
        return;
      }

      const result = await callService.initiateCall({
        phoneNumber: data.phoneNumber.replace(/[\s\-\(\)]/g, ''), // Clean phone number
        patientName: data.patientName.trim(),
        patientDOB: data.patientDOB,
        memberId: data.memberId.trim()
      });

      if (result.success) {
        toast.success(`${result.message}${result.callSid ? ` (Call ID: ${result.callSid})` : ''}`);
        console.log('Call initiated successfully:', result);
        
        // Reset form after successful call
        reset();
      } else {
        toast.error('Failed to initiate call');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to initiate call. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-sky-500 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Benefits Call</h1>
          <p className="text-gray-600">Enter patient information to initiate benefits verification</p>
        </div>

        {/* Configuration Warning */}
        {!isConfigured && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-700 mb-2">
                  Twilio configuration is required to make calls.
                </p>
                <Link
                  to="/settings"
                  className="inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800 underline"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Configure Settings
                </Link>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow-xl rounded-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('patientName', { 
                    required: 'Patient name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                  placeholder="John Smith"
                />
              </div>
              {errors.patientName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.patientName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="patientDOB" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  {...register('patientDOB', { 
                    required: 'Date of birth is required',
                    validate: (value) => {
                      const today = new Date();
                      const birthDate = new Date(value);
                      const age = today.getFullYear() - birthDate.getFullYear();
                      if (age < 0 || age > 120) {
                        return 'Please enter a valid date of birth';
                      }
                      return true;
                    }
                  })}
                  className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.patientDOB && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.patientDOB.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Insurance Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  {...register('phoneNumber', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^\+?[1-9][\d\s\-\(\)]{7,20}$/,
                      message: 'Please enter a valid phone number'
                    }
                  })}
                  className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                  placeholder="+1 (800) 123-4567"
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.phoneNumber.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the insurance provider's customer service number
              </p>
            </div>

            <div>
              <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-2">
                Member ID *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  {...register('memberId', { 
                    required: 'Member ID is required',
                    minLength: {
                      value: 3,
                      message: 'Member ID must be at least 3 characters'
                    }
                  })}
                  className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm transition-colors"
                  placeholder="ABC123456789"
                />
              </div>
              {errors.memberId && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.memberId.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isConfigured}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Initiating Call...
                </>
              ) : (
                <>
                  <Phone className="mr-2 h-5 w-5" />
                  Start Insurance Call
                </>
              )}
            </button>
          </form>

          {isConfigured && (
            <div className="mt-6 p-4 bg-sky-50 rounded-lg">
              <div className="flex items-start">
                <Building className="h-5 w-5 text-sky-500 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-sky-700">
                  <p className="font-medium mb-1">Using your configured Twilio settings:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <strong>Patient Name:</strong> User input</li>
                    <li>• <strong>Date of Birth:</strong> User input</li>
                    <li>• <strong>Phone Number:</strong> User input (insurance provider)</li>
                    <li>• <strong>Member ID:</strong> User input</li>
                    <li>• <strong>From Number:</strong> Your configured Twilio number</li>
                    <li>• <strong>Twilio Credentials:</strong> Your configured settings</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewCall;
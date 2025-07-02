import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Phone, User, Building } from 'lucide-react';
import axios from 'axios';

interface FormData {
  patientName: string;
  patientDOB: string;
  phoneNumber: string;
  memberId: string;
  insuranceProvider: string;
}

const NewCall: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);

      // Split name into first and last
      const [firstName, ...lastNameParts] = data.patientName.split(' ');
      const lastName = lastNameParts.join(' ');

      // First create conversation with agent memory
      const memoryResponse = await axios.post(
        'https://api.elevenlabs.io/v1/agents/eTuhUa5gtEbj7gTJQNOs/conversations',
        {
          memory: {
            patient_first: firstName,
            patient_last: lastName,
            dob: data.patientDOB,
            member_id: data.memberId,
            insurance_provider: data.insuranceProvider
          }
        },
        {
          headers: {
            'xi-api-key': import.meta.env.VITE_ELEVEN_LABS_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      // Get Twilio webhook URL from response
      const { twilio_url } = memoryResponse.data;

      // Make Twilio call using the webhook URL
      const twilioResponse = await axios.post(
        'https://api.twilio.com/2010-04-01/Accounts/' + 
        import.meta.env.VITE_TWILIO_ACCOUNT_SID + '/Calls.json',
        new URLSearchParams({
          'To': data.phoneNumber,
          'From': import.meta.env.VITE_TWILIO_PHONE_NUMBER,
          'Url': twilio_url
        }),
        {
          auth: {
            username: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
            password: import.meta.env.VITE_TWILIO_AUTH_TOKEN
          }
        }
      );

      toast.success('Call initiated successfully!');
      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to initiate call. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">New Insurance Call</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
            Patient Name
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register('patientName', { required: 'Patient name is required' })}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              placeholder="John Smith"
            />
          </div>
          {errors.patientName && (
            <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="patientDOB" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            {...register('patientDOB', { required: 'Date of birth is required' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
          />
          {errors.patientDOB && (
            <p className="mt-1 text-sm text-red-600">{errors.patientDOB.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
            Insurance Phone Number
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              {...register('phoneNumber', { required: 'Phone number is required' })}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              placeholder="+1 (800) 123-4567"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">
            Insurance Provider
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Building className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              {...register('insuranceProvider', { required: 'Insurance provider is required' })}
              className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
              placeholder="Blue Cross Blue Shield"
            />
          </div>
          {errors.insuranceProvider && (
            <p className="mt-1 text-sm text-red-600">{errors.insuranceProvider.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="memberId" className="block text-sm font-medium text-gray-700">
            Member ID
          </label>
          <input
            type="text"
            {...register('memberId', { required: 'Member ID is required' })}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500"
            placeholder="ABC123456789"
          />
          {errors.memberId && (
            <p className="mt-1 text-sm text-red-600">{errors.memberId.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
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
              Start Call
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewCall;
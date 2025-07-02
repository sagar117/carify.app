import axios from 'axios';
import { settingsService } from '../settingsService';

interface InitiateCallParams {
  phoneNumber: string;
  patientName: string;
  patientDOB: string;
  memberId: string;
}

interface CallResponse {
  success: boolean;
  callSid?: string;
  message: string;
}

export const callService = {
  // Initiate a new outbound call to insurance provider
  initiateCall: async (params: InitiateCallParams): Promise<CallResponse> => {
    try {
      console.log('Sending API call with params:', params);
      
      // Get Twilio settings from localStorage
      const twilioSettings = settingsService.getTwilioSettings();
      
      // Check if Twilio is configured
      if (!settingsService.isTwilioConfigured()) {
        throw new Error('Twilio is not configured. Please go to Settings to configure your Twilio credentials.');
      }
      
      const requestData = {
        to: params.phoneNumber,
        from: twilioSettings.phoneNumber,
        twilioAccountSid: twilioSettings.accountSid,
        twilioAuthToken: twilioSettings.authToken,
        voiceUrl: twilioSettings.voiceUrl || `${import.meta.env.VITE_API_BASE_URL}/incoming`,
        // User-entered values
        patientName: params.patientName,
        patientDOB: params.patientDOB,
        memberId: params.memberId
      };
      
      console.log('Request data being sent:', {
        ...requestData,
        twilioAuthToken: '[REDACTED]' // Don't log sensitive data
      });
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(
        `${apiBaseUrl}/api/initiate-call`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000 // 10 second timeout
        }
      );
      
      console.log('API response:', response.data);
      
      return {
        success: true,
        callSid: response.data.callSid || response.data.call_sid,
        message: response.data.message || 'Call initiated successfully'
      };
    } catch (error) {
      console.error('Error initiating call:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Cannot connect to call service. Please check if the API server is running.');
        }
        
        const errorMessage = error.response?.data?.error || 
                           error.response?.data?.message || 
                           error.message;
        throw new Error(`Failed to initiate call: ${errorMessage}`);
      }
      
      throw new Error('Failed to initiate call. Please try again.');
    }
  }
};
import axios from 'axios';

interface InitiateCallParams {
  phoneNumber: string;
  patientName: string;
  patientDOB: string;
  memberId: string;
  insuranceProvider: string;
  npiNumber: string;
  taxId: string;
  clinicName: string;
  clinicAddress: string;
}

interface CallResponse {
  callSid: string;
  status: string;
  message: string;
}

interface CallStatusResponse {
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'failed' | 'busy' | 'no-answer';
  duration: string;
}

export const twilioService = {
  // Initiate a new outbound call
  initiateCall: async (params: InitiateCallParams): Promise<CallResponse> => {
    try {
      const response = await axios.post(
        'https://wxkipsntjfuzzmnbfdbi.supabase.co/functions/v1/voice-agent',
        params,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error initiating call:', error);
      throw new Error(error.response?.data?.error || 'Failed to initiate call. Please try again.');
    }
  },
  
  // Get the status of an existing call
  getCallStatus: async (callSid: string): Promise<CallStatusResponse> => {
    try {
      const response = await axios.get(
        `https://wxkipsntjfuzzmnbfdbi.supabase.co/functions/v1/voice-agent/status/${callSid}`,
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting call status:', error);
      throw new Error('Failed to retrieve call status.');
    }
  },
  
  // End an in-progress call
  endCall: async (callSid: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `https://wxkipsntjfuzzmnbfdbi.supabase.co/functions/v1/voice-agent/end/${callSid}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          }
        }
      );
      
      return response.data.success;
    } catch (error) {
      console.error('Error ending call:', error);
      throw new Error('Failed to end call.');
    }
  }
};
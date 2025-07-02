import { create } from 'zustand';
import { twilioService } from '../services/api/twilioService';

export type CallStatus = 'idle' | 'initiating' | 'testing' | 'calling' | 'navigating' | 'retrieving' | 'completed' | 'failed';

interface CallState {
  callSid: string | null;
  callStatus: CallStatus;
  statusMessage: string;
  error: string | null;
  callData: {
    patientName: string;
    patientDOB: string;
    insuranceProvider: string;
    phoneNumber: string;
    memberId: string;
    npiNumber: string;
    taxId: string;
    clinicName: string;
    clinicAddress: string;
  } | null;
  
  // Actions
  initiateCall: (callData: {
    patientName: string;
    patientDOB: string;
    insuranceProvider: string;
    phoneNumber: string;
    memberId: string;
    npiNumber: string;
    taxId: string;
    clinicName: string;
    clinicAddress: string;
  }) => Promise<void>;
  updateCallStatus: (status: CallStatus, message?: string) => void;
  cancelCall: () => Promise<boolean>;
  resetCallState: () => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  callSid: null,
  callStatus: 'idle',
  statusMessage: '',
  error: null,
  callData: null,
  
  initiateCall: async (callData) => {
    try {
      set({ 
        callStatus: 'initiating', 
        statusMessage: 'Preparing to make the call...', 
        error: null,
        callData
      });
      
      // First stage - testing voice & connection
      set({ callStatus: 'testing', statusMessage: 'Testing voice agent connection...' });
      
      // Start the call
      const response = await twilioService.initiateCall({
        phoneNumber: callData.phoneNumber,
        patientName: callData.patientName,
        patientDOB: callData.patientDOB,
        memberId: callData.memberId,
        insuranceProvider: callData.insuranceProvider,
        npiNumber: callData.npiNumber,
        taxId: callData.taxId,
        clinicName: callData.clinicName,
        clinicAddress: callData.clinicAddress
      });
      
      set({ 
        callSid: response.callSid, 
        callStatus: 'calling',
        statusMessage: 'Connecting to insurance provider...'
      });
      
      // Start polling for call status
      const pollStatus = async () => {
        if (!get().callSid) return;
        
        try {
          const status = await twilioService.getCallStatus(get().callSid!);
          
          switch (status.status) {
            case 'in-progress':
              set({ 
                callStatus: 'retrieving',
                statusMessage: 'Retrieving benefits information...'
              });
              break;
            case 'completed':
              set({ 
                callStatus: 'completed',
                statusMessage: 'Benefits information successfully retrieved'
              });
              return; // Stop polling
            case 'failed':
            case 'busy':
            case 'no-answer':
              set({ 
                callStatus: 'failed',
                statusMessage: `Call failed: ${status.status}`,
                error: `Call ended with status: ${status.status}`
              });
              return; // Stop polling
          }
          
          // Continue polling if call is still active
          setTimeout(pollStatus, 5000);
        } catch (error) {
          set({ 
            callStatus: 'failed',
            error: 'Failed to get call status',
            statusMessage: 'Call status check failed'
          });
        }
      };
      
      // Start polling
      pollStatus();
      
    } catch (error) {
      set({ 
        callStatus: 'failed', 
        error: error instanceof Error ? error.message : 'Failed to initiate call', 
        statusMessage: 'Call failed'
      });
    }
  },
  
  updateCallStatus: (status: CallStatus, message?: string) => {
    set({ 
      callStatus: status,
      statusMessage: message || get().statusMessage
    });
  },
  
  cancelCall: async () => {
    const { callSid } = get();
    
    if (!callSid) {
      set({ callStatus: 'idle', callSid: null });
      return true;
    }
    
    try {
      await twilioService.endCall(callSid);
      set({ callStatus: 'idle', callSid: null });
      return true;
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel call'
      });
      return false;
    }
  },
  
  resetCallState: () => {
    set({
      callSid: null,
      callStatus: 'idle',
      statusMessage: '',
      error: null,
      callData: null
    });
  }
}));
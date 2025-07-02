import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Twilio } from 'npm:twilio@4.19.0';
import axios from 'npm:axios@1.6.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

interface CallRequest {
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

// Store active calls and their status
const activeCalls = new Map<string, {
  status: string;
  duration: string;
  conversationId?: string;
}>();

async function updateAgentMemory(data: CallRequest) {
  try {
    const [firstName, ...lastNameParts] = data.patientName.split(' ');
    const lastName = lastNameParts.join(' ');

    const memory = {
      patient_first: firstName,
      patient_last: lastName,
      dob: data.patientDOB,
      provider_npi: data.npiNumber,
      tax_id: data.taxId,
      clinic_name: data.clinicName,
      clinic_address: data.clinicAddress,
      member_id: data.memberId,
      insurance_provider: data.insuranceProvider
    };

    const response = await axios.post(
      'https://api.elevenlabs.io/v1/agents/eTuhUa5gtEbj7gTJQNOs/conversations',
      { memory },
      {
        headers: {
          'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY')!,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating agent memory:', error);
    throw new Error('Failed to update agent memory');
  }
}

async function initiateCall(data: CallRequest) {
  try {
    console.log('Initiating call with data:', data);
    
    // First update the agent memory and get conversation details
    const conversation = await updateAgentMemory(data);
    const webhookUrl = conversation.twilio_url;

    console.log('Agent memory updated, webhook URL:', webhookUrl);

    // Initialize Twilio client
    const client = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID')!,
      Deno.env.get('TWILIO_AUTH_TOKEN')!
    );
    
    // Make the call using Twilio with the agent webhook URL
    const call = await client.calls.create({
      to: data.phoneNumber,
      from: Deno.env.get('TWILIO_PHONE_NUMBER')!,
      url: webhookUrl,
      statusCallback: `${Deno.env.get('SUPABASE_URL')}/functions/v1/voice-agent/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    console.log('Call created successfully:', call.sid);

    // Store call information
    activeCalls.set(call.sid, {
      status: call.status,
      duration: '0:00',
      conversationId: conversation.conversation_id
    });

    return {
      callSid: call.sid,
      status: call.status,
      message: 'Call initiated successfully'
    };
  } catch (error) {
    console.error('Error initiating call:', error);
    throw new Error('Failed to initiate call: ' + (error.message || 'Unknown error'));
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname.split('/').filter(Boolean);

  try {
    // Handle call initiation
    if (req.method === 'POST' && path.length === 1) {
      console.log('Received call initiation request');
      
      const data: CallRequest = await req.json();
      const result = await initiateCall(data);

      return new Response(
        JSON.stringify(result),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Handle status callback from Twilio
    if (req.method === 'POST' && path[1] === 'status') {
      const formData = await req.formData();
      const callSid = formData.get('CallSid') as string;
      const status = formData.get('CallStatus') as string;
      const duration = formData.get('CallDuration') as string;

      console.log('Received status callback:', { callSid, status, duration });

      if (callSid && activeCalls.has(callSid)) {
        activeCalls.set(callSid, {
          ...activeCalls.get(callSid)!,
          status,
          duration: duration ? `${Math.floor(parseInt(duration) / 60)}:${(parseInt(duration) % 60).toString().padStart(2, '0')}` : '0:00',
        });
      }

      return new Response(null, { status: 200, headers: corsHeaders });
    }

    // Handle status check
    if (req.method === 'GET' && path[1] === 'status' && path[2]) {
      const callSid = path[2];
      const callInfo = activeCalls.get(callSid);

      if (!callInfo) {
        return new Response(
          JSON.stringify({ error: 'Call not found' }),
          {
            status: 404,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      return new Response(
        JSON.stringify({
          status: callInfo.status,
          duration: callInfo.duration,
          conversationId: callInfo.conversationId
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Handle call termination
    if (req.method === 'POST' && path[1] === 'end' && path[2]) {
      const callSid = path[2];
      const client = new Twilio(
        Deno.env.get('TWILIO_ACCOUNT_SID')!,
        Deno.env.get('TWILIO_AUTH_TOKEN')!
      );
      
      await client.calls(callSid).update({ status: 'completed' });
      activeCalls.delete(callSid);

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { Twilio } from 'npm:twilio@4.19.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CallRequest {
  phoneNumber: string;
  patientName: string;
  memberId: string;
  insuranceProvider: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const client = new Twilio(
      Deno.env.get('TWILIO_ACCOUNT_SID') || '',
      Deno.env.get('TWILIO_AUTH_TOKEN') || ''
    );

    const { phoneNumber, patientName, memberId, insuranceProvider }: CallRequest = await req.json();

    // Initiate the call using Twilio
    const call = await client.calls.create({
      to: phoneNumber,
      from: Deno.env.get('TWILIO_PHONE_NUMBER') || '',
      twiml: `<Response>
        <Say>Initiating benefits verification call for ${patientName} with ${insuranceProvider}. Member ID: ${memberId}</Say>
      </Response>`,
    });

    return new Response(
      JSON.stringify({
        callSid: call.sid,
        status: call.status,
        message: 'Call has been initiated',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to initiate call',
      }),
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
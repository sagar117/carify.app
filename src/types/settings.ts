export interface TwilioSettings {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
  voiceUrl: string;
}

export interface AppSettings {
  twilio: TwilioSettings;
}
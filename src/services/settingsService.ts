import { AppSettings, TwilioSettings } from '../types/settings';

const SETTINGS_KEY = 'insurance-voice-agent-settings';

const defaultSettings: AppSettings = {
  twilio: {
    accountSid: '',
    authToken: '',
    phoneNumber: '',
    voiceUrl: ''
  }
};

export const settingsService = {
  // Get settings from localStorage
  getSettings: (): AppSettings => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultSettings, ...parsed };
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
    return defaultSettings;
  },

  // Save settings to localStorage
  saveSettings: (settings: AppSettings): void => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw new Error('Failed to save settings');
    }
  },

  // Get Twilio settings specifically
  getTwilioSettings: (): TwilioSettings => {
    return settingsService.getSettings().twilio;
  },

  // Save Twilio settings specifically
  saveTwilioSettings: (twilioSettings: TwilioSettings): void => {
    const currentSettings = settingsService.getSettings();
    settingsService.saveSettings({
      ...currentSettings,
      twilio: twilioSettings
    });
  },

  // Check if Twilio is configured
  isTwilioConfigured: (): boolean => {
    const twilio = settingsService.getTwilioSettings();
    return !!(twilio.accountSid && twilio.authToken && twilio.phoneNumber);
  }
};
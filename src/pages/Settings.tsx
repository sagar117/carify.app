import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Settings as SettingsIcon, Save, Eye, EyeOff, Phone, Key, Globe, AlertCircle, CheckCircle } from 'lucide-react';
import { settingsService } from '../services/settingsService';
import { TwilioSettings } from '../types/settings';

const Settings: React.FC = () => {
  const [showAuthToken, setShowAuthToken] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<TwilioSettings>();

  useEffect(() => {
    // Load existing settings
    const settings = settingsService.getTwilioSettings();
    reset(settings);
    setIsConfigured(settingsService.isTwilioConfigured());
  }, [reset]);

  // Watch form values to update configuration status
  const watchedValues = watch();
  useEffect(() => {
    const hasAllFields = !!(watchedValues.accountSid && watchedValues.authToken && watchedValues.phoneNumber);
    setIsConfigured(hasAllFields);
  }, [watchedValues]);

  const onSubmit = async (data: TwilioSettings) => {
    try {
      // Validate phone number format
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      if (!phoneRegex.test(data.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
        toast.error('Please enter a valid phone number');
        return;
      }

      // Clean phone number
      const cleanedData = {
        ...data,
        phoneNumber: data.phoneNumber.replace(/[\s\-\(\)]/g, ''),
        voiceUrl: data.voiceUrl || import.meta.env.VITE_API_BASE_URL + '/incoming'
      };

      settingsService.saveTwilioSettings(cleanedData);
      toast.success('Settings saved successfully!');
      setIsConfigured(true);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const handleReset = () => {
    const defaultSettings: TwilioSettings = {
      accountSid: '',
      authToken: '',
      phoneNumber: '',
      voiceUrl: ''
    };
    reset(defaultSettings);
    settingsService.saveTwilioSettings(defaultSettings);
    toast.info('Settings reset to default values');
    setIsConfigured(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your Twilio credentials for voice calls</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Configuration Status */}
          <div className={`px-6 py-4 border-b ${isConfigured ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center">
              {isConfigured ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-green-700 font-medium">Twilio is configured and ready</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                  <span className="text-amber-700 font-medium">Twilio configuration required</span>
                </>
              )}
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700 mb-2">
                  Twilio Account SID *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    {...register('accountSid', { 
                      required: 'Account SID is required',
                      pattern: {
                        value: /^AC[a-f0-9]{32}$/,
                        message: 'Account SID must start with "AC" followed by 32 characters'
                      }
                    })}
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    // placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  />
                </div>
                {errors.accountSid && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.accountSid.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Found in your Twilio Console dashboard
                </p>
              </div>

              <div>
                <label htmlFor="authToken" className="block text-sm font-medium text-gray-700 mb-2">
                  Twilio Auth Token *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showAuthToken ? "text" : "password"}
                    {...register('authToken', { 
                      required: 'Auth Token is required',
                      minLength: {
                        value: 32,
                        message: 'Auth Token must be at least 32 characters'
                      }
                    })}
                    className="pl-10 pr-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="Your Twilio Auth Token"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowAuthToken(!showAuthToken)}
                  >
                    {showAuthToken ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.authToken && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.authToken.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Keep this secure - found in your Twilio Console
                </p>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Twilio Phone Number *
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
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.phoneNumber.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Your purchased Twilio phone number
                </p>
              </div>

              <div>
                <label htmlFor="voiceUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Webhook URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    {...register('voiceUrl')}
                    className="pl-10 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder={`${import.meta.env.VITE_API_BASE_URL}/incoming`}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to use default webhook URL
                </p>
              </div>

              <div className="flex space-x-4 pt-6">
                <button
                  type="submit"
                  className="flex-1 flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Settings
                </button>
                
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 px-8 py-6 border-t">
            <h3 className="text-sm font-medium text-gray-900 mb-3">How to get your Twilio credentials:</h3>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">1</span>
                Sign up for a Twilio account at <a href="https://www.twilio.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">twilio.com</a>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">2</span>
                Purchase a phone number from the Twilio Console
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">3</span>
                Find your Account SID and Auth Token in the Console dashboard
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3 mt-0.5">4</span>
                Enter the credentials above and save
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Save, Volume2, Phone, Mic, HelpCircle, Key } from 'lucide-react';

const Settings: React.FC = () => {
  const [twilioSettings, setTwilioSettings] = useState({
    accountSid: '',
    authToken: '',
    phoneNumber: '+19787319073'
  });
  
  const [elevenLabsSettings, setElevenLabsSettings] = useState({
    apiKey: '',
    voiceId: 'premium-male-voice-1',
    model: 'eleven_turbo_v2'
  });
  
  const [callSettings, setCallSettings] = useState({
    maxCallDuration: 10,
    recordCalls: true,
    useBackupProvider: false,
    backupProviderId: ''
  });
  
  const [apiTestStatus, setApiTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  
  const handleTwilioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTwilioSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleElevenLabsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setElevenLabsSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCallSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setCallSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };
  
  const testApiConnection = async () => {
    try {
      setApiTestStatus('testing');
      
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success!
      setApiTestStatus('success');
      toast.success('API connection successful!');
    } catch (error) {
      setApiTestStatus('error');
      toast.error('API connection failed. Please check your credentials.');
    }
  };
  
  const saveSettings = () => {
    // Simulate saving
    toast.success('Settings saved successfully!');
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure your voice agent and API connections
        </p>
      </div>
      
      {/* Twilio Settings */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <Phone className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">Twilio Settings</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="accountSid" className="block text-sm font-medium text-gray-700">
                Account SID
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="accountSid"
                  name="accountSid"
                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={twilioSettings.accountSid}
                  onChange={handleTwilioChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Find in your Twilio console dashboard
              </p>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="authToken" className="block text-sm font-medium text-gray-700">
                Auth Token
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="authToken"
                  name="authToken"
                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={twilioSettings.authToken}
                  onChange={handleTwilioChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Find in your Twilio console dashboard
              </p>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Twilio Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={twilioSettings.phoneNumber}
                  onChange={handleTwilioChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                The phone number to use for outbound calls
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Eleven Labs Settings */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <Volume2 className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">Eleven Labs Settings</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                API Key
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  id="apiKey"
                  name="apiKey"
                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={elevenLabsSettings.apiKey}
                  onChange={handleElevenLabsChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Find in your Eleven Labs dashboard
              </p>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="voiceId" className="block text-sm font-medium text-gray-700">
                Voice ID
              </label>
              <div className="mt-1">
                <select
                  id="voiceId"
                  name="voiceId"
                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={elevenLabsSettings.voiceId}
                  onChange={handleElevenLabsChange}
                >
                  <option value="premium-male-voice-1">Professional Male (Premium)</option>
                  <option value="premium-female-voice-1">Professional Female (Premium)</option>
                  <option value="standard-male-voice-1">Standard Male</option>
                  <option value="standard-female-voice-1">Standard Female</option>
                  <option value="custom-voice-1">Custom Voice Upload</option>
                </select>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Voice Model
              </label>
              <div className="mt-1">
                <select
                  id="model"
                  name="model"
                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={elevenLabsSettings.model}
                  onChange={handleElevenLabsChange}
                >
                  <option value="eleven_turbo_v2">Eleven Turbo v2 (Recommended)</option>
                  <option value="eleven_multilingual_v2">Multilingual v2</option>
                  <option value="eleven_monolingual_v1">Monolingual v1</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call Settings */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <Mic className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">Call Settings</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="maxCallDuration" className="block text-sm font-medium text-gray-700">
                Maximum Call Duration (minutes)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="maxCallDuration"
                  name="maxCallDuration"
                  min="1"
                  max="30"
                  className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={callSettings.maxCallDuration}
                  onChange={handleCallSettingsChange}
                />
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-start mt-6">
                <div className="flex items-center h-5">
                  <input
                    id="recordCalls"
                    name="recordCalls"
                    type="checkbox"
                    className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded"
                    checked={callSettings.recordCalls}
                    onChange={handleCallSettingsChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="recordCalls" className="font-medium text-gray-700">Record Calls</label>
                  <p className="text-gray-500">Store call recordings for quality and training purposes</p>
                </div>
              </div>
            </div>
            
            <div className="sm:col-span-3">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="useBackupProvider"
                    name="useBackupProvider"
                    type="checkbox"
                    className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-300 rounded"
                    checked={callSettings.useBackupProvider}
                    onChange={handleCallSettingsChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="useBackupProvider" className="font-medium text-gray-700">Use Backup Provider</label>
                  <p className="text-gray-500">Enable fallback to a secondary voice provider if primary fails</p>
                </div>
              </div>
            </div>
            
            {callSettings.useBackupProvider && (
              <div className="sm:col-span-3">
                <label htmlFor="backupProviderId" className="block text-sm font-medium text-gray-700">
                  Backup Provider ID
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="backupProviderId"
                    name="backupProviderId"
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={callSettings.backupProviderId}
                    onChange={handleCallSettingsChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Test Connection */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex items-center">
          <HelpCircle className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium leading-6 text-gray-900">Test Connection</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-500 mb-4">
            Test the connection to Twilio and Eleven Labs before making calls.
          </p>
          
          <button
            type="button"
            onClick={testApiConnection}
            disabled={apiTestStatus === 'testing'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {apiTestStatus === 'testing' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing Connection...
              </>
            ) : (
              <>
                <Key className="mr-2 h-4 w-4" />
                Test API Connection
              </>
            )}
          </button>
          
          {apiTestStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    Connection successful! Your API credentials are valid.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {apiTestStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">
                    Connection failed. Please check your API credentials and try again.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Save Settings Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;

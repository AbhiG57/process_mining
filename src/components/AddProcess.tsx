import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faLink, 
  faQuestionCircle, 
  faUser, 
  faToggleOn, 
  faToggleOff,
  faVideo,
  faFileAlt,
  faImage,
  faBolt
} from '@fortawesome/free-solid-svg-icons';

interface Integrations {
  teams: boolean;
  serviceNow: boolean;
  email: boolean;
}

interface Tab {
  id: string;
  label: string;
  icon: any;
}

interface Integration {
  key: keyof Integrations;
  label: string;
  enabled: boolean;
}

const AddProcess = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [processName, setProcessName] = useState<string>('');
  const [processDescription, setProcessDescription] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [integrations, setIntegrations] = useState<Integrations>({
    teams: false,
    serviceNow: true,
    email: false
  });

  const handleIntegrationToggle = (integration: keyof Integrations): void => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files;
    // Handle file upload logic here
    console.log('Files uploaded:', files);
  };

  const handleStartIngestion = (): void => {
    // Handle start ingestion logic here
    console.log('Starting ingestion process...');
  };

  const handlePreviewLogs = (): void => {
    // Handle preview logs logic here
    console.log('Previewing logs...');
  };

  const handleReset = (): void => {
    setProcessName('');
    setProcessDescription('');
    setUrl('');
    setIntegrations({
      teams: false,
      serviceNow: true,
      email: false
    });
  };

  const tabs: Tab[] = [
    { id: 'video', label: 'Video', icon: faVideo },
    { id: 'documents', label: 'Documents', icon: faFileAlt },
    { id: 'images', label: 'Images', icon: faImage }
  ];

  const integrationList: Integration[] = [
    { key: 'teams', label: 'Microsoft Teams', enabled: integrations.teams },
    { key: 'serviceNow', label: 'ServiceNow', enabled: integrations.serviceNow },
    { key: 'email', label: 'Email', enabled: integrations.email }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Data Ingestion Module</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure and start a new data ingestion process.</p>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Process Details Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Process Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Process Name
              </label>
              <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                placeholder="e.g., Quarterly Financials Analysis"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Process Description
              </label>
              <textarea
                value={processDescription}
                onChange={(e) => setProcessDescription(e.target.value)}
                placeholder="Describe the purpose of this data ingestion process."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Data Sources Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Sources</h2>
          
          {/* Upload Files */}
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Upload Files</h3>
            
            {/* Tabs */}
            <div className="flex space-x-1 mb-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <FontAwesomeIcon icon={faUpload} className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                {activeTab === 'video' && 'MP4, AVI, MOV (max. 500MB)'}
                {activeTab === 'documents' && 'PDF, DOC, DOCX (max. 100MB)'}
                {activeTab === 'images' && 'JPG, PNG, GIF (max. 50MB)'}
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept={
                  activeTab === 'video' ? 'video/*' :
                  activeTab === 'documents' ? '.pdf,.doc,.docx' :
                  'image/*'
                }
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Browse Files
              </label>
            </div>
          </div>

          {/* Fetch from URL */}
          <div>
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Fetch from URL</h3>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faBolt} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" 
              />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/data.json"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* External Integrations Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">External Integrations</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Ingest logs and data directly from your favorite tools.</p>
          
          <div className="space-y-4">
            {integrationList.map((integration) => (
              <div key={integration.key} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <span className="text-gray-700 dark:text-gray-300">{integration.label}</span>
                <button
                  onClick={() => handleIntegrationToggle(integration.key)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      integration.enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  <span
                    className={`inline-block h-6 w-11 rounded-full transition-colors ${
                      integration.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handlePreviewLogs}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Preview Logs
          </button>
          <button
            onClick={handleStartIngestion}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Start Ingestion
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProcess; 
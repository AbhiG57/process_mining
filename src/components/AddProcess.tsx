import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faVideo,
  faFileAlt,
  faImage,
  faBolt,
  faTrash,
  faChevronLeft, faChevronRight,
  faCog, faLink
} from '@fortawesome/free-solid-svg-icons';
import AddToolIntegrationModal from './AddToolIntegrationModal';
import { faMicrosoft, faSlack, faJira, faGithub, faLine, faGoogleDrive } from '@fortawesome/free-brands-svg-icons';

interface Integrations {
  teams: boolean;
  servicenow: boolean;
  pam: boolean;
  rawlogs: boolean;
}

interface Tab {
  key: string;
  label: string;
  icon: any;
}

interface Integration {
  key: string;
  label: string;
  icon: any;
  status: 'connected' | 'not-connected' | 'sync-failed';
  lastSynced?: string;
  recordsFetched?: number;
  filesFetched?: number;
}

const dataSourceTabs: Tab[] = [
  { key: 'video', label: 'Video', icon: faVideo },
  { key: 'file', label: 'File', icon: faFileAlt },
  { key: 'image', label: 'Image', icon: faImage },
  { key: 'api', label: 'API', icon: faBolt },
];

const integrationList: Integration[] = [
  {
    key: 'servicenow',
    label: 'ServiceNow',
    icon: faBolt,
    status: 'connected',
    lastSynced: '2 hours ago',
    recordsFetched: 1324
  },
  {
    key: 'googledrive',
    label: 'Google Drive',
    icon: faBolt,
    status: 'sync-failed',
    filesFetched: 0
  }
];

const AddProcess = () => {
  const [activeTab, setActiveTab] = useState<string>('video');
  const [integrations, setIntegrations] = useState<Integrations>({
    teams: false,
    servicenow: false,
    pam: false,
    rawlogs: false,
  });
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false);
  const [showServiceNowConfig, setShowServiceNowConfig] = useState(false);

  // Popular Integrations carousel data
  const popularTools: { id: string; name: string; bg: string; pill: string, icon: any }[] = [
    { id: 'teams', name: 'Microsoft Teams', bg: 'bg-[#D9B26B]', pill: 'M', icon: faMicrosoft },
    { id: 'servicenow', name: 'ServiceNow', bg: 'bg-[#2b4f52]', pill: 'S',icon: faMicrosoft },
    { id: 'slack', name: 'Slack', bg: 'bg-[#8FB299]', pill: 's',icon: faSlack },
    { id: 'googleDrive', name: 'Google Drive', bg: 'bg-[#2b4f52]', pill: 'G',icon: faGoogleDrive },
    { id: 'jira', name: 'Jira', bg: 'bg-[#4f7d61]', pill: 'J',icon: faJira },
    { id: 'line', name: 'LINE', bg: 'bg-[#2c4a45]', pill: 'l',icon: faLine },
    { id: 'github', name: 'GitHub', bg: 'bg-[#2b3b46]', pill: 'G',icon: faGithub },
    { id: 'zoom', name: 'Zoom', bg: 'bg-[#2b4f52]', pill: 'Z',icon: faMicrosoft },
  ];
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File uploaded:', file.name);
    }
  };

  const handleReset = (): void => {
    setIntegrations({
      teams: false,
      servicenow: false,
      pam: false,
      rawlogs: false,
    });
  };

  const handlePreviewLogs = (): void => {
    console.log('Preview logs clicked');
  };

  const handleStartIngestion = (): void => {
    console.log('Start ingestion clicked');
  };

  const scrollLeft = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = (): void => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const getStatusConfig = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return {
          label: 'Connected',
          color: 'text-green-500',
          bg: 'bg-green-500',
          icon: '●'
        };
      case 'not-connected':
        return {
          label: 'Not connected',
          color: 'text-gray-500',
          bg: 'bg-gray-500',
          icon: '●'
        };
      case 'sync-failed':
        return {
          label: 'Sync failed',
          color: 'text-red-500',
          bg: 'bg-red-500',
          icon: '●'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Process</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Configure data ingestion for process mining</p>
        </div>

        {/* Process Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Process Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Process Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter process name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Sources</h2>
          <div className="flex space-x-4 mb-4">
            {dataSourceTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <FontAwesomeIcon icon={faUpload} className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 mb-4">Drag and drop files here or click to browse</p>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>
        </div>

        {/* External Integrations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
            <span>External Integrations</span>
            <button onClick={() => setShowAddIntegrationModal(true)} className="px-3 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold">+ Add New Tool</button>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Ingest logs and data directly from your favorite tools.</p>

          {/* Integration Status Cards */}
          <div className="space-y-4">
            {integrationList.map((integration) => {
              const statusConfig = getStatusConfig(integration.status);
              return (
                <div key={integration.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={integration.icon} className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{integration.label}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1 text-sm ${statusConfig.color}`}>
                          <span className={statusConfig.bg}>●</span>
                          {statusConfig.label}
                        </span>
                        {integration.lastSynced && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Last synced: {integration.lastSynced}
                          </span>
                        )}
                        {integration.recordsFetched !== undefined && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Records fetched: {integration.recordsFetched.toLocaleString()}
                          </span>
                        )}
                        {integration.filesFetched !== undefined && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {integration.filesFetched} files fetched
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {integration.status === 'not-connected' || integration.status === 'sync-failed' ? (
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-colors">
                        <FontAwesomeIcon icon={faLink} className="w-3 h-3" />
                        Connect
                      </button>
                    ) : null}
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                      <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                      <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Popular Integrations Carousel */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Integrations</h3>
            </div>
            <div className="relative">
              <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
              <div ref={scrollRef} className="flex gap-6 py-2 overflow-x-auto scrollbar-hide">
                {popularTools.map(tool => (
                  <div key={tool.id} className="flex flex-col items-center w-24" onClick={() => {setShowServiceNowConfig(true);setShowAddIntegrationModal(true)}}>
                    <div className={`w-20 h-20 rounded-xl ${tool.bg} flex items-center justify-center shadow-inner`}> 
                      <FontAwesomeIcon icon={tool.icon} className='w-10 h-10 text-white' size='2x' />
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center leading-snug">{tool.name}</div>
                  </div>
                ))}
              </div>
              <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
                <FontAwesomeIcon icon={faChevronRight} className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
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
      <AddToolIntegrationModal openConfig={showServiceNowConfig} open={showAddIntegrationModal} onClose={() => setShowAddIntegrationModal(false)} />
    </div>
  );
};

export default AddProcess; 
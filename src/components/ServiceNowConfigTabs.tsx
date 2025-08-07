import React, { useState } from 'react';

const TABS = [
  { id: 'connection', label: 'Connection Settings' },
  { id: 'sync', label: 'Data Sync' },
  { id: 'advanced', label: 'Advanced Options' },
];

interface ServiceNowConfigTabsProps {
  onBack: () => void;
}

const ServiceNowConfigTabs: React.FC<ServiceNowConfigTabsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('connection');
  const [connected, setConnected] = useState(false);
  const [authMethod, setAuthMethod] = useState('');
  const [syncType, setSyncType] = useState('predefined');
  const [syncFrequency, setSyncFrequency] = useState('Daily');
  const [method, setMethod] = useState('GET');

  return (
    <div className="bg-[#181C23] text-white max-w-2xl w-full rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <div className="text-2xl font-bold">Configure Tool - ServiceNow</div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-lg font-bold focus:outline-none">← Back</button>
      </div>
      <div className="flex gap-8 px-8 border-b border-[#23272F] mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`pb-2 text-base font-medium border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="px-8 pb-8">
        {activeTab === 'connection' && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">API Endpoint</label>
              <input type="text" placeholder="e.g. https://dev12345.service-now.com" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Auth Method</label>
              <select className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500" value={authMethod} onChange={e => setAuthMethod(e.target.value)}>
                <option value="">Select method</option>
                <option value="basic">Basic Auth</option>
                <option value="apiKey">API Key</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input type="text" placeholder="Enter your username" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Password/API Key</label>
              <input type="password" placeholder="Enter your password or API key" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
            </div>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors">Test Connection</button>
            {connected && <div className="mt-3 text-green-400 flex items-center gap-2"><span className="w-4 h-4 bg-green-400 rounded-full inline-block"></span>Connected</div>}
          </div>
        )}
        {activeTab === 'sync' && (
          <div>
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Data Source Type</label>
              <select className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500" value={syncType} onChange={e => setSyncType(e.target.value)}>
                <option value="predefined">Predefined Modules</option>
                <option value="custom">Custom API</option>
              </select>
            </div>
            {syncType === 'predefined' ? (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Module Selection</label>
                  <div className="space-y-2">
                    {['Incidents', 'Change Requests', 'Problem Tickets', 'Assets', 'Users', 'CI'].map(module => (
                      <label key={module} className="flex items-center gap-3">
                        <input type="checkbox" className="form-checkbox rounded text-blue-600 bg-[#23272F] border-gray-600 focus:ring-blue-500" />
                        <span>{module}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Sync Frequency</label>
                  <select className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500" value={syncFrequency} onChange={e => setSyncFrequency(e.target.value)}>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
                <div className="flex gap-4 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2">Initial Sync Start Date</label>
                    <input type="date" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-2">Initial Sync End Date</label>
                    <input type="date" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <button className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-semibold transition-colors">Preview Sample Data</button>
                <div className="text-xs text-gray-400 mt-4">Note: Data fields are automatically mapped based on the selected modules.</div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">API URL</label>
                  <input type="text" placeholder="Enter API URL" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Method</label>
                  <select className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500" value={method} onChange={e => setMethod(e.target.value)}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Headers</label>
                  <div className="flex gap-4 mb-2">
                    <input type="text" placeholder="Header Name 1" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Header Value 1" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex gap-4 mb-2">
                    <input type="text" placeholder="Header Name 2" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Header Value 2" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button className="px-4 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-semibold transition-colors mt-2">Add Header</button>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">Query Parameters</label>
                  <div className="flex gap-4 mb-2">
                    <input type="text" placeholder="Parameter Name 1" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Parameter Value 1" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex gap-4 mb-2">
                    <input type="text" placeholder="Parameter Name 2" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Parameter Value 2" className="flex-1 px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <button className="px-4 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-semibold transition-colors mt-2">Add Param</button>
                </div>
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors">Test API</button>
                <div className="text-xs text-gray-400 mt-4">Note: Data fields are automatically mapped based on the selected modules.</div>
              </>
            )}
          </div>
        )}
        {activeTab === 'advanced' && (
          <div className="text-gray-400">Advanced options coming soon...</div>
        )}
      </div>
    </div>
  );
};

export default ServiceNowConfigTabs;
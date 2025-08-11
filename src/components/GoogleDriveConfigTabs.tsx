import React, { useMemo, useState } from 'react';

const TABS = [
  { id: 'connection', label: 'Connection Settings' },
  { id: 'sync', label: 'Data Sync' },
  { id: 'advanced', label: 'Advanced Options' },
];

interface GoogleDriveConfigTabsProps {
  onBack: () => void;
}

type DataSourceType = 'filePath' | 'browse';

const GoogleDriveConfigTabs: React.FC<GoogleDriveConfigTabsProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('connection');

  // Connection state
  const [authMethod, setAuthMethod] = useState<'oauth' | 'serviceAccount'>('oauth');
  const [connected, setConnected] = useState<boolean>(false);
  const [connectedEmail, setConnectedEmail] = useState<string>('');

  // Sync state
  const [dataSourceType, setDataSourceType] = useState<DataSourceType>('filePath');
  const [filePath, setFilePath] = useState<string>('');
  const [syncFrequency, setSyncFrequency] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [allowedFileTypes, setAllowedFileTypes] = useState<Record<string, boolean>>({ PDF: true, Excel: true });
  const [includeSharedDrives, setIncludeSharedDrives] = useState<boolean>(true);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Advanced options
  const [versionControl, setVersionControl] = useState<string>('Keep all versions');
  const [notifyOnFailure, setNotifyOnFailure] = useState<boolean>(true);
  const [notifyEmail, setNotifyEmail] = useState<string>('user@email.com');

  const allFiles = useMemo(
    () => [
      { type: 'folder', name: 'Reports', date: 'Feb 1, 2025' },
      { type: 'folder', name: 'Client Documents', date: 'Jan 15, 2025' },
      { type: 'file', name: 'Q4_Sales_Data.xlsx', date: 'Jan 31, 2025' },
      { type: 'file', name: 'Team_Meeting_Notes.docx', date: 'Jan 28, 2025' },
      { type: 'file', name: 'Company_Policies.pdf', date: 'Jan 10, 2025' },
    ],
    []
  );

  function toggleFile(name: string) {
    setSelectedFiles(prev => (prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]));
  }

  function connect() {
    // Mock connection flow
    setConnected(true);
    setConnectedEmail('email@example.com');
  }

  function disconnect() {
    setConnected(false);
    setConnectedEmail('');
  }

  return (
    <div className="bg-[#181C23] text-white max-w-2xl w-full rounded-xl shadow-lg overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <div className="text-2xl font-bold">Configure Tool – Google Drive</div>
        <button onClick={onBack} className="text-gray-400 hover:text-white text-lg font-bold focus:outline-none">← Back</button>
      </div>

      <div className="flex gap-8 px-8 border-b border-[#23272F] mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`pb-2 text-base font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-blue-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-8 pb-8">
        {activeTab === 'connection' && (
          <div className="space-y-6">
            <div>
              <div className="mb-3 text-sm font-semibold">Connection Method</div>
              <div className="rounded-lg border border-[#23272F] bg-[#1C212A] p-4">
                {authMethod === 'oauth' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-300">Connect via Google OAuth. Secure login via Google. Your credentials are not stored.</div>
                    <button onClick={connect} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">G Connect to Google Drive</button>
                    <button className="block text-blue-400 hover:text-blue-300 text-sm" onClick={() => setAuthMethod('serviceAccount')}>Use Service Account instead</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Client Email</label>
                        <input type="email" placeholder="service-account@project.iam.gserviceaccount.com" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Project ID</label>
                        <input type="text" placeholder="my-gcp-project" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Private Key</label>
                      <textarea placeholder="-----BEGIN PRIVATE KEY-----" className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500" rows={4} />
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={connect} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">Connect</button>
                      <button className="text-blue-400 hover:text-blue-300 text-sm" onClick={() => setAuthMethod('oauth')}>Use OAuth instead</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold">Connection Status</div>
              <div className="rounded-lg border border-[#23272F] bg-[#1C212A] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full inline-block ${connected ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  <div>
                    <div className="font-semibold">{connected ? 'Connected' : 'Not connected'}</div>
                    {connected && (
                      <div className="text-sm text-gray-400">Signed in as {connectedEmail}</div>
                    )}
                  </div>
                </div>
                <div>
                  {connected ? (
                    <button className="text-blue-400 hover:text-blue-300" onClick={disconnect}>Disconnect</button>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md font-semibold">Test Connection</button>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Data Source Type</label>
                <select
                  className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500"
                  value={dataSourceType}
                  onChange={e => setDataSourceType(e.target.value as DataSourceType)}
                >
                  <option value="filePath">File Path</option>
                  <option value="browse">Browse & Select</option>
                </select>
              </div>
              {dataSourceType === 'filePath' && (
                <div>
                  <label className="block text-sm font-semibold mb-2">File Path</label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/file/d/123xyz"
                    className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    value={filePath}
                    onChange={e => setFilePath(e.target.value)}
                  />
                </div>
              )}
            </div>

            {dataSourceType === 'filePath' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Sync Frequency</label>
                    <select
                      className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500"
                      value={syncFrequency}
                      onChange={e => setSyncFrequency(e.target.value as any)}
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Allowed File Types</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(allowedFileTypes).map(key => (
                        <button
                          key={key}
                          className={`px-3 py-1 rounded-full text-sm border ${
                            allowedFileTypes[key]
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-[#23272F] border-[#2B313B] text-gray-300'
                          }`}
                          onClick={() => setAllowedFileTypes(prev => ({ ...prev, [key]: !prev[key] }))}
                        >
                          {key}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-semibold">Include Shared Drives</label>
                  <button
                    type="button"
                    onClick={() => setIncludeSharedDrives(v => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      includeSharedDrives ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        includeSharedDrives ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-300">{includeSharedDrives ? 'Enabled' : 'Disabled'}</span>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-[#23272F] bg-[#1C212A]">
                <div className="flex items-center justify-between p-3 border-b border-[#23272F] text-sm">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="px-2 py-1 rounded bg-[#23272F]">Root</span>
                    <span>›</span>
                    <span className="px-2 py-1 rounded bg-[#23272F]">Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Search in folder"
                      className="px-3 py-1.5 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                    />
                    <select className="px-3 py-1.5 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500">
                      <option>All Files</option>
                      <option>Docs</option>
                      <option>Sheets</option>
                      <option>PDF</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-[#23272F]">
                  {allFiles.map(item => (
                    <div key={item.name} className="flex items-center gap-3 p-3 hover:bg-[#20252F]">
                      {item.type === 'file' ? (
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(item.name)}
                          onChange={() => toggleFile(item.name)}
                          className="form-checkbox rounded text-blue-600 bg-[#23272F] border-gray-600 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="w-4" />
                      )}
                      <div className="flex-1">{item.name}</div>
                      <div className="w-32 text-right text-sm text-gray-400">{item.date}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between p-3 border-t border-[#23272F]">
                  <div className="flex flex-wrap gap-2">
                    {selectedFiles.map(name => (
                      <span key={name} className="px-2 py-1 text-sm rounded bg-[#23272F]">{name}</span>
                    ))}
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold" disabled={selectedFiles.length === 0}>
                    Next →
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors">Save Changes</button>
            </div>
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">File Version Control</label>
              <select
                className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none focus:ring-2 focus:ring-blue-500"
                value={versionControl}
                onChange={e => setVersionControl(e.target.value)}
              >
                <option>Keep all versions</option>
                <option>Keep only latest</option>
                <option>Overwrite on update</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="notify"
                type="checkbox"
                checked={notifyOnFailure}
                onChange={e => setNotifyOnFailure(e.target.checked)}
                className="form-checkbox rounded text-blue-600 bg-[#23272F] border-gray-600 focus:ring-blue-500"
              />
              <label htmlFor="notify" className="font-medium">Email me if sync fails</label>
            </div>

            {notifyOnFailure && (
              <div>
                <label className="block text-sm font-semibold mb-2">Email address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md bg-[#23272F] text-white border-none placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                  value={notifyEmail}
                  onChange={e => setNotifyEmail(e.target.value)}
                />
              </div>
            )}

            <div>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors">Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleDriveConfigTabs;



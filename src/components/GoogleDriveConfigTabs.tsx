import React, { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFolder, 
  faFile, 
  faFilePdf, 
  faFileExcel, 
  faFileWord, 
  faFilePowerpoint, 
  faFileCsv,
  faSearch,
  faFilter,
  faLock,
  faCheck,
  faTimes,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

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
      { type: 'folder', name: 'Marketing Assets', date: 'Aug 15, 2024', size: null },
      { type: 'folder', name: 'Q3 Reports', date: 'Jul 29, 2024', size: null },
      { type: 'file', name: 'Financial Projections.xlsx', date: 'Yesterday', size: '2.1 MB', fileType: 'excel', locked: true, selected: true },
      { type: 'file', name: 'Project Brief v2.pdf', date: 'Aug 21, 2024', size: '856 KB', fileType: 'pdf' },
      { type: 'file', name: 'Kickoff Presentation.pptx', date: 'Aug 18, 2024', size: '15.4 MB', fileType: 'powerpoint' },
      { type: 'file', name: 'user_data_export.csv', date: 'Aug 12, 2024', size: '34.7 MB', fileType: 'csv' },
      { type: 'file', name: 'Meeting Notes.docx', date: 'Aug 20, 2024', size: '1.2 MB', fileType: 'word', selected: true },
    ],
    []
  );

  function toggleFile(name: string) {
    setSelectedFiles(prev => (prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]));
  }

  function removeSelectedFile(name: string) {
    setSelectedFiles(prev => prev.filter(f => f !== name));
  }

  function getFileIcon(fileType: string) {
    switch (fileType) {
      case 'pdf': return faFilePdf;
      case 'excel': return faFileExcel;
      case 'word': return faFileWord;
      case 'powerpoint': return faFilePowerpoint;
      case 'csv': return faFileCsv;
      default: return faFile;
    }
  }

  function getFileIconColor(fileType: string) {
    switch (fileType) {
      case 'pdf': return 'text-red-500';
      case 'excel': return 'text-green-500';
      case 'word': return 'text-blue-500';
      case 'powerpoint': return 'text-orange-500';
      case 'csv': return 'text-gray-500';
      default: return 'text-gray-400';
    }
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
    <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white max-w-2xl w-full rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-8 pt-8 pb-2">
        <div className="text-2xl font-bold">Configure Tool – Google Drive</div>
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg font-bold focus:outline-none">← Back</button>
      </div>

      <div className="flex gap-8 px-8 border-b border-gray-200 dark:border-gray-700 mb-6">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`pb-3 text-base font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
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
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4">
                {authMethod === 'oauth' ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">Connect via Google OAuth. Secure login via Google. Your credentials are not stored.</div>
                    <button onClick={connect} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">Connect to Google Drive</button>
                    <button className="block text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm" onClick={() => setAuthMethod('serviceAccount')}>Use Service Account instead</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">Client Email</label>
                        <input type="email" placeholder="service-account@project.iam.gserviceaccount.com" className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">Project ID</label>
                        <input type="text" placeholder="my-gcp-project" className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Private Key</label>
                      <textarea placeholder="-----BEGIN PRIVATE KEY-----" className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={4} />
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={connect} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md font-semibold">Connect</button>
                      <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm" onClick={() => setAuthMethod('oauth')}>Use OAuth instead</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold">Connection Status</div>
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-5 h-5 rounded-full inline-block ${connected ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <div>
                    <div className="font-semibold">{connected ? 'Connected' : 'Not connected'}</div>
                    {connected && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">Signed in as {connectedEmail}</div>
                    )}
                  </div>
                </div>
                <div>
                  {connected ? (
                    <button className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" onClick={disconnect}>Disconnect</button>
                  ) : null}
                </div>
              </div>
            </div>

            <div>
              <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-md font-semibold">Test Connection</button>
            </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Data Source Type</label>
                <select
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-300'
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
                      includeSharedDrives ? 'bg-blue-600' : 'bg-gray-400'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        includeSharedDrives ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{includeSharedDrives ? 'Enabled' : 'Disabled'}</span>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-600 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 font-medium">Root</span>
                    <span>›</span>
                    <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-600 font-medium">Projects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      placeholder="Search in folder"
                      className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select className="px-3 py-1.5 rounded-md bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>All Files</option>
                      <option>Docs</option>
                      <option>Sheets</option>
                      <option>PDF</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {allFiles.map(item => (
                    <div 
                      key={item.name} 
                      className={`flex items-center gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                        item.selected ? 'bg-blue-100 dark:bg-blue-900/20 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      {item.type === 'file' ? (
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(item.name)}
                          onChange={() => toggleFile(item.name)}
                          className="form-checkbox rounded text-blue-600 bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-blue-500 h-4 w-4"
                        />
                      ) : (
                        <div className="w-4" />
                      )}
                      
                      <div className="flex items-center gap-3 flex-1">
                        <FontAwesomeIcon 
                          icon={item.type === 'folder' ? faFolder : getFileIcon(item.fileType || '')} 
                          className={`text-lg ${
                            item.type === 'folder' 
                              ? 'text-blue-500 dark:text-blue-400' 
                              : getFileIconColor(item.fileType || '')
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{item.name}</span>
                            {item.locked && (
                              <FontAwesomeIcon icon={faLock} className="text-gray-500 dark:text-gray-400 text-xs" />
                            )}
                            {item.selected && (
                              <FontAwesomeIcon icon={faCheck} className="text-blue-500 dark:text-blue-400 text-sm" />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-gray-500 dark:text-gray-400 min-w-[120px]">
                        <div>{item.date}</div>
                        {item.size && <div className="text-xs">{item.size}</div>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected Files Bar */}
                {selectedFiles.length > 0 && (
                  <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{selectedFiles.length} files selected</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedFiles.map(name => (
                          <span 
                            key={name} 
                            className="inline-flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-full text-gray-700 dark:text-gray-200"
                          >
                            {name.length > 20 ? name.substring(0, 20) + '...' : name}
                            <button
                              onClick={() => removeSelectedFile(name)}
                              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                              <FontAwesomeIcon icon={faTimes} className="text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                    <button 
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold transition-colors flex items-center gap-2"
                      disabled={selectedFiles.length === 0}
                    >
                      Next
                      <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
                    </button>
                  </div>
                )}
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
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="form-checkbox rounded text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500"
              />
              <label htmlFor="notify" className="font-medium">Email me if sync fails</label>
            </div>

            {notifyOnFailure && (
              <div>
                <label className="block text-sm font-semibold mb-2">Email address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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



import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCheck, faPlus } from '@fortawesome/free-solid-svg-icons';
import ServiceNowConfigTabs from './ServiceNowConfigTabs';
import GoogleDriveConfigTabs from './GoogleDriveConfigTabs';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  added: boolean;
}

const mockIntegrations: Integration[] = [
  {
    id: 'teams',
    name: 'Microsoft Teams',
    description: 'Fetch collaboration history, monitor channels, and automate workflows.',
    icon: <div className="w-10 h-10 rounded bg-[#4F6BED] flex items-center justify-center text-white font-bold text-lg">M</div>,
    category: 'Communication',
    added: true,
  },
  {
    id: 'servicenow',
    name: 'ServiceNow',
    description: 'Ingest incident, problem, and change data to correlate with other signals.',
    icon: <div className="w-10 h-10 rounded bg-[#F6C343] flex items-center justify-center text-white font-bold text-lg">S</div>,
    category: 'ITSM',
    added: true,
  },
  {
    id: 'googleDrive',
    name: 'Google Drive',
    description: 'Ingest incident, problem, and change data to correlate with other signals.',
    icon: <div className="w-10 h-10 rounded bg-[#F6C343] flex items-center justify-center text-white font-bold text-lg">G</div>,
    category: 'ITSM',
    added: true,
  },
  {
    id: 'pam',
    name: 'PAM',
    description: 'Capture privileged access activity and correlate with other signals.',
    icon: <div className="w-10 h-10 rounded bg-[#3B4D3B] flex items-center justify-center text-white font-bold text-lg">P</div>,
    category: 'Logs',
    added: false,
  },
  {
    id: 'rawlogs',
    name: 'Raw Logs',
    description: 'Upload and map raw logs to search and correlate with other signals.',
    icon: <div className="w-10 h-10 rounded bg-[#D6B279] flex items-center justify-center text-white font-bold text-lg">R</div>,
    category: 'Logs',
    added: false,
  },
];

const categories = ['All', 'Communication', 'ITSM', 'Logs', 'APIs'];

interface AddToolIntegrationModalProps {
  open: boolean;
  onClose: () => void;
  selectedTool?: string | null;
}

type ActiveConfig = 'servicenow' | 'googleDrive' | null;

const AddToolIntegrationModal: React.FC<AddToolIntegrationModalProps> = ({ open, onClose, selectedTool }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeConfig, setActiveConfig] = useState<ActiveConfig>(null);

  useEffect(() => {
    if (open) {
      if (selectedTool === 'servicenow') {
        setActiveConfig('servicenow');
      } else if (selectedTool === 'googleDrive') {
        setActiveConfig('googleDrive');
      } else {
        setActiveConfig(null);
      }
    } else {
      setActiveConfig(null);
    }
  }, [open, selectedTool]);

  const filtered = mockIntegrations.filter((integration) => {
    const matchesCategory = activeCategory === 'All' || integration.category === activeCategory;
    const matchesSearch = integration.name.toLowerCase().includes(search.toLowerCase()) || integration.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      {activeConfig === 'servicenow' ? (
        <ServiceNowConfigTabs onBack={() => setActiveConfig(null)} />
      ) : activeConfig === 'googleDrive' ? (
        <GoogleDriveConfigTabs onBack={() => setActiveConfig(null)} />
      ) : (
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white max-w-2xl w-full rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="px-8 pt-8 pb-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">Add Tool Integration</div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl font-bold focus:outline-none">×</button>
            </div>
          </div>
          <div className="px-8 pb-2">
            <div className="relative mb-6">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tools..."
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-6 mb-4 border-b border-gray-200 dark:border-gray-700">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeCategory === cat ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="px-8 pb-8 max-h-[340px] overflow-y-auto">
            {filtered.map(integration => (
              <div key={integration.id} className="flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="flex items-center gap-4">
                  {integration.icon}
                  <div>
                    <div className="font-semibold text-base text-gray-900 dark:text-white">{integration.name}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm mt-1">{integration.description}</div>
                  </div>
                </div>
                {integration.id === 'servicenow' || integration.id === 'googleDrive' ? (
                  <button
                    className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors bg-blue-600 hover:bg-blue-700 text-white`}
                    onClick={() => setActiveConfig(integration.id as ActiveConfig)}
                  >
                    Configure
                  </button>
                ) : (
                  <button
                    className={`px-5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${integration.added ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-default' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                    disabled={integration.added}
                  >
                    {integration.added ? (
                      <>
                        <FontAwesomeIcon icon={faCheck} className="mr-2" /> Added
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
                      </>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToolIntegrationModal;
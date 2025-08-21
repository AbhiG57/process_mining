import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCopy, faTrash, faPlus, faCheck, faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

interface Process {
  id: number;
  created: string;
  transcription: string;
  status: string;
  statusColor: string;
  title: string;
  description: string;
}

interface StatusCard {
  label: string;
  value: number;
  color: string;
}

// Hardcoded default processes
const defaultProcesses: Process[] = [
  {
    id: 1,
    created: '2024-01-15',
    transcription: '2/3',
    status: 'IN REVIEW',
    statusColor: 'bg-orange-500',
    title: 'Shopping on Amazon',
    description:
      'The user either logs into their existing Amazon account or creates a new one',
  },
  {
    id: 2,
    created: '2024-01-15',
    transcription: '2/3',
    status: 'COMPLETED',
    statusColor: 'bg-green-600',
    title: 'Data Entry Automation',
    description:
      'Automates data entry tasks, reducing manual effort and errors.',
  },
  {
    id: 3,
    created: '2024-01-15',
    transcription: '2/3',
    status: 'IN PROGRESS',
    statusColor: 'bg-blue-600',
    title: 'Customer Onboarding',
    description:
      'Streamlines the customer onboarding process with automated workflows.',
  },
  {
    id: 4,
    created: '2024-01-15',
    transcription: '1/3',
    status: 'INACTIVE',
    statusColor: 'bg-gray-400',
    title: 'Old Process',
    description:
      'Legacy process that has been decommissioned.',
  },
];

const statusCards: StatusCard[] = [
  { label: 'In Review', value: 8, color: 'bg-orange-500' },
  { label: 'Completed', value: 17, color: 'bg-green-600' },
  { label: 'In Progress', value: 5, color: 'bg-blue-600' },
  { label: 'Inactive', value: 4, color: 'bg-gray-400' },
];

const recentActivities = [
  { icon: faCheck, text: '"Data Entry" marked as completed.', color: 'text-green-500' },
  { icon: faPlus, text: 'New process "Customer Onboarding" created.', color: 'text-blue-500' },
  { icon: faEdit, text: '"Shopping on Amazon" was edited.', color: 'text-orange-500' },
  { icon: faTrash, text: '"Old Process" was made inactive.', color: 'text-red-500' },
];

function ProcessListingNew() {
  const navigate = useNavigate();
  const location = useLocation();
  const [processes, setProcesses] = useState<Process[]>(defaultProcesses);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Function to load processes from localStorage
  const loadProcesses = () => {
    const storedProcesses: Process[] = JSON.parse(localStorage.getItem('processes') || '[]');
    console.log('Loading processes from localStorage:', storedProcesses);
    
    // Combine default processes with stored processes, avoiding duplicates
    const combinedProcesses = [...defaultProcesses];
    storedProcesses.forEach(storedProcess => {
      if (!defaultProcesses.some(dp => dp.id === storedProcess.id)) {
        combinedProcesses.push(storedProcess);
      }
    });
    
    console.log('Combined processes:', combinedProcesses);
    setProcesses(combinedProcesses);
  };

  useEffect(() => {
    // Load processes on component mount
    loadProcesses();

    // Listen for storage changes to refresh processes when localStorage is updated
    const handleStorageChange = () => {
      loadProcesses();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also refresh when the component becomes visible (for navigation from other pages)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProcesses();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Refresh processes when navigating to this page
  useEffect(() => {
    console.log('Location changed, refreshing processes...');
    loadProcesses();
  }, [location.pathname]);

  const handleDeleteProcess = (processId: number): void => {
    // Only allow deletion of non-default processes
    if (defaultProcesses.some(dp => dp.id === processId)) {
      return; // Don't allow deletion of default processes
    }
    const updatedProcesses = processes.filter(process => process.id !== processId);
    // Update localStorage with remaining non-default processes
    const nonDefaultProcesses = updatedProcesses.filter(
      process => !defaultProcesses.some(dp => dp.id === process.id)
    );
    localStorage.setItem('processes', JSON.stringify(nonDefaultProcesses));
    setProcesses(updatedProcesses);
  };

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || 
                         (activeFilter === 'Active' && process.status !== 'INACTIVE') ||
                         (activeFilter === 'Inactive' && process.status === 'INACTIVE');
    return matchesSearch && matchesFilter;
  });

  const totalProcesses = processes.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1A1D2B] text-gray-900 dark:text-white px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Processes</h1>
        <button 
          onClick={() => navigate(`/createProcess`)} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-[#6B48FF] dark:hover:bg-[#5A3FE8] text-white font-medium px-2 py-1 rounded text-sm transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
          Create Process
        </button>
      </div>

      {/* Overview and Recent Activity Cards */}
      <div className="flex gap-4 mb-6">
        {/* Overview Card */}
        <div className="flex-[2] bg-white dark:bg-[#222638] rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium mb-4 text-gray-900 dark:text-white">Overview</h3>
          <div className="flex gap-16">
            <div>
              <div className="text-3xl font-bold mb-1 text-gray-900 dark:text-white">{totalProcesses}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Processes</div>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Breakdown by Status</div>
              <div className="space-y-2.5">
                {statusCards.map((card) => (
                  <div key={card.label} className="flex items-center gap-3">
                    <div className="w-28 text-sm text-gray-600 dark:text-gray-400">{card.label}</div>
                    <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${card.color} rounded-full`} 
                        style={{ 
                          width: `${(card.value / 34) * 100}%`,
                          transition: 'width 0.3s ease-in-out'
                        }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm text-gray-700 dark:text-gray-300">{card.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="flex-1 bg-white dark:bg-[#222638] rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h3 className="text-sm font-medium mb-3 text-gray-900 dark:text-white">Recent Activity</h3>
          <div className="space-y-2">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2 text-xs">
                <FontAwesomeIcon icon={activity.icon} className={`${activity.color} text-xs`} />
                <span className="text-gray-700 dark:text-gray-300">{activity.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Processes Section */}
      <div className="bg-white dark:bg-[#222638] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-900 dark:text-white">All Processes</h2>
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-xs" />
              <input
                type="text"
                placeholder="Search processes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-50 dark:bg-[#222638] text-gray-900 dark:text-white text-sm px-7 py-1.5 rounded w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300 dark:border-gray-600"
              />
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-1">
              {['All', 'Active', 'Inactive'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    activeFilter === filter 
                      ? 'bg-blue-600 dark:bg-[#6B48FF] text-white' 
                      : 'bg-gray-100 dark:bg-[#222638] text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Process List */}
        <div className="p-4 space-y-2">
          {filteredProcesses.map((process) => (
            <div
              key={process.id}
              className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 dark:hover:bg-[#222638] transition-colors cursor-pointer rounded border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
              onClick={() => navigate(`/process/${process.id}`)}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{process.title}</div>
                  <span
                    className={`px-2 py-0.5 text-sm font-medium rounded ${
                      process.status === 'IN REVIEW' ? 'bg-orange-500/20 text-orange-500' :
                      process.status === 'COMPLETED' ? 'bg-green-500/20 text-green-500' :
                      process.status === 'IN PROGRESS' ? 'bg-blue-500/20 text-blue-500' :
                      'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {process.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Created: {process.created} | Transcription: {process.transcription}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">{process.description}</div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="bg-gray-100 hover:bg-gray-200 dark:bg-[#222638] dark:hover:bg-gray-600 px-3 py-1 rounded text-sm font-medium text-gray-700 dark:text-white transition-colors">
                  Test
                </button>
                <div className="flex items-center gap-4 ml-3">
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                    <FontAwesomeIcon icon={faEdit} className="text-lg" />
                  </button>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                    <FontAwesomeIcon icon={faEye} className="text-lg" />
                  </button>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">
                    <FontAwesomeIcon icon={faCopy} className="text-lg" />
                  </button>
                  {!defaultProcesses.some(dp => dp.id === process.id) && (
                    <button 
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProcess(process.id);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 mt-6">
          <button className="px-2 py-1 rounded text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">‹</button>
          <button className="px-2 py-1 rounded text-sm bg-blue-600 dark:bg-[#6B48FF] text-white">1</button>
          <button className="px-2 py-1 rounded text-sm text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">2</button>
          <button className="px-2 py-1 rounded text-sm text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">3</button>
          <span className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">...</span>
          <button className="px-2 py-1 rounded text-sm text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">8</button>
          <button className="px-2 py-1 rounded text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white">›</button>
        </div>
      </div>
    </div>
  );
}

export default ProcessListingNew;

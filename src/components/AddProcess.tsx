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
  faCog, faLink, faCloud, faSquare, faTimes, faGripVertical,
  faChevronUp,
  faChevronDown,
  faDesktop,
  faFileExcel,
  faFilePdf,
  faFileWord,
  faFileImage,
  faFileVideo,
  faFileCsv
} from '@fortawesome/free-solid-svg-icons';
import AddToolIntegrationModal from './AddToolIntegrationModal';
import { faMicrosoft, faSlack, faJira, faGithub, faLine, faGoogleDrive } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';

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

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const dataSourceTabs: Tab[] = [
  { key: 'video', label: 'Video', icon: faVideo },
  { key: 'file', label: 'File', icon: faFileAlt },
  { key: 'image', label: 'Image', icon: faImage }
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('video');
  const [integrations, setIntegrations] = useState<Integrations>({
    teams: false,
    servicenow: false,
    pam: false,
    rawlogs: false,
  });
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<UploadedFile | null>(null);
  const [currentStep, setCurrentStep] = useState<'setup' | 'review'>('setup');
  
  // Add process details state
  const [processName, setProcessName] = useState<string>('');
  const [processDescription, setProcessDescription] = useState<string>('');

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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAcceptedFileTypes = (tabKey: string): string => {
    switch (tabKey) {
      case 'video':
        return 'video/*';
      case 'image':
        return 'image/*';
      case 'file':
        return '.pdf,.doc,.docx,.txt,.csv,.xlsx,.xls';
      default:
        return '*/*';
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('video/')) return faFileVideo;
    if (fileType.startsWith('image/')) return faFileImage;
    if (fileType.includes('pdf')) return faFilePdf;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return faFileExcel;
    if (fileType.includes('word') || fileType.includes('document')) return faFileWord;
    if (fileType.includes('csv')) return faFileCsv;
    return faFileAlt;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles: UploadedFile[] = files.map(file => ({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
    // Reset input value to allow same file selection
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const newFiles: UploadedFile[] = files.map(file => ({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (fileId: string): void => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    // Clear preview if the removed file was selected
    if (selectedFileForPreview && selectedFileForPreview.id === fileId) {
      setSelectedFileForPreview(null);
    }
  };

  const handleFileSelect = (file: UploadedFile): void => {
    setSelectedFileForPreview(file);
  };

  const renderFilePreview = (file: UploadedFile) => {
    if (file.type.startsWith('image/')) {
      return (
        <div className="h-full flex items-center justify-center">
          <img 
            src={URL.createObjectURL(file.file)} 
            alt={file.name}
            className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            style={{ maxHeight: '400px' }}
          />
        </div>
      );
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <div className="h-full flex items-center justify-center">
          <video 
            controls 
            className="max-w-full rounded-lg shadow-sm"
            style={{ maxHeight: '400px' }}
            src={URL.createObjectURL(file.file)}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    if (file.type.includes('pdf')) {
      return (
        <div className="h-full">
          <iframe
            src={`${URL.createObjectURL(file.file)}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full rounded-lg border-0"
            style={{ height: '400px' }}
            title={file.name}
          />
        </div>
      );
    }
    
    // For text-based files (docx, txt, csv, etc.)
    if (file.type.includes('text/') || file.type.includes('document') || file.type.includes('csv') || file.type.includes('sheet')) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="bg-white dark:bg-gray-600 p-6 rounded-lg border border-gray-200 dark:border-gray-500" style={{ height: '400px', width: '100%' }}>
            <div className="text-center">
              <FontAwesomeIcon icon={faFileAlt} className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Preview of: {file.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {file.type.includes('csv') || file.type.includes('sheet') ? 
                  'Spreadsheet data preview not available. Please download the file to view full content.' :
                  'Document preview not available. Please download the file to view full content.'
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Default fallback
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400" style={{ height: '400px' }}>
          <FontAwesomeIcon icon={faFileAlt} className="w-16 h-16 mx-auto mb-3" />
          <p className="text-sm">Preview not available for this file type</p>
          <p className="text-xs mt-1">File: {file.name}</p>
        </div>
      </div>
    );
  };

  // Drag and drop reordering for review data
  const handleDragStart = (e: React.DragEvent, fileId: string): void => {
    setDraggedItem(fileId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverReview = (e: React.DragEvent): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropReview = (e: React.DragEvent, targetFileId: string): void => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetFileId) return;

    setUploadedFiles(prev => {
      const draggedIndex = prev.findIndex(file => file.id === draggedItem);
      const targetIndex = prev.findIndex(file => file.id === targetFileId);
      
      const newFiles = [...prev];
      const [draggedFile] = newFiles.splice(draggedIndex, 1);
      newFiles.splice(targetIndex, 0, draggedFile);
      
      return newFiles;
    });
    setDraggedItem(null);
  };

  const handleDragEnd = (): void => {
    setDraggedItem(null);
  };

  const handleReset = (): void => {
    setIntegrations({
      teams: false,
      servicenow: false,
      pam: false,
      rawlogs: false,
    });
    setUploadedFiles([]);
  };

  const handlePreviewLogs = (): void => {
    console.log('Preview logs clicked');
  };

  const handleNext = (): void => {
    if (!processName.trim()) {
      alert('Please enter a process name before proceeding.');
      return;
    }
    
    if (uploadedFiles.length > 0) {
      setCurrentStep('review');
    } else {
      alert('Please upload at least one file before proceeding to review.');
    }
  };

  const handleBack = (): void => {
    setCurrentStep('setup');
    setSelectedFileForPreview(null);
  };

  const handleSave = (): void => {
    console.log('Saving process configuration...');
    // Here you would typically save the process configuration
    alert('Process configuration saved successfully!');
  };

  const handleStartIngestion = (): void => {
    // Validate required fields
    if (!processName.trim()) {
      alert('Please enter a process name');
      return;
    }
    
    if (uploadedFiles.length === 0) {
      alert('Please upload at least one file before starting ingestion');
      return;
    }

    // Create new process object
    const newProcess = {
      id: Date.now(),
      created: new Date().toISOString().split('T')[0],
      transcription: '0/3',
      status: 'IN PROGRESS',
      statusColor: 'bg-blue-600',
      title: processName.trim(),
      description: processDescription.trim() || `Process created from ${uploadedFiles.length} uploaded file(s).`,
    };

    try {
      // Get existing processes from localStorage
      const existingProcesses = JSON.parse(localStorage.getItem('processes') || '[]');
      
      // Add new process to the list
      const updatedProcesses = [...existingProcesses, newProcess];
      
      // Save to localStorage
      localStorage.setItem('processes', JSON.stringify(updatedProcesses));

      // Show success message
      alert('Data ingestion started successfully!');
      
      // Debug: Log the saved process
      console.log('New process saved:', newProcess);
      console.log('All processes in localStorage:', updatedProcesses);
      
      // Navigate to the process listing page
      navigate('/process');
    } catch (error) {
      console.error('Error saving process:', error);
      alert('Failed to start ingestion process. Please try again.');
    }
  };

  const handleSettingsClick = (integrationKey: string): void => {
    setSelectedTool(integrationKey);
    setShowAddIntegrationModal(true);
  };

  const handleCloseModal = () => {
    setShowAddIntegrationModal(false);
    setSelectedTool(null);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Add Process</h1>
        </div>

        {currentStep === 'setup' ? (
          <>
        {/* Process Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Process Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Process Name</label>
              <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter process name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={processDescription}
                onChange={(e) => setProcessDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        {/* Data Sources */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Data Sources</h2>
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
              
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragOver
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
            <FontAwesomeIcon icon={faUpload} className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Drag and drop {activeTab === 'video' ? 'video' : activeTab === 'image' ? 'image' : 'file'}s here or click to browse
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {activeTab === 'video' ? 'Supported formats: MP4, MOV, AVI, WMV' :
                   activeTab === 'image' ? 'Supported formats: JPG, PNG, GIF, SVG' :
                   'Supported formats: PDF, DOC, XLS, CSV, TXT'}
                </p>
            <input
                  ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
                  accept={getAcceptedFileTypes(activeTab)}
                  multiple
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

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Uploaded Files</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div className="flex items-center gap-3">
                          <FontAwesomeIcon icon={getFileIcon(file.type)} className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{file.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1"
                        >
                          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
        </div>

        {/* External Integrations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-5">
              <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-2 flex items-center justify-between">
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
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors" onClick={() => handleSettingsClick(integration.key)}>
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
              <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Popular Integrations</h3>
            </div>
            <div className="relative">
              <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none">
                <FontAwesomeIcon icon={faChevronLeft} className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
              <div ref={scrollRef} className="flex gap-6 py-2 overflow-x-auto scrollbar-hide">
                {popularTools.map(tool => (
                      <div key={tool.id} className="flex flex-col items-center w-24" onClick={() => {
                        setSelectedTool(tool.id);
                        setShowAddIntegrationModal(true);
                      }}>
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
            <div className="flex justify-end space-x-4 pt-4">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
                onClick={handleNext}
                disabled={uploadedFiles.length === 0}
                className={`px-6 py-2 rounded-md transition-colors ${
                  uploadedFiles.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          /* Review Input Data Step */
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Review Input Data</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review and verify the data files that will be processed for mining.</p>
            </div>
            
            {/* File List with Expandable Rows */}
            <div className="space-y-2">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file, index) => (
                  <div key={file.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                    {/* Main Row - Always Visible */}
                    <div 
                      draggable
                      onDragStart={(e) => handleDragStart(e, file.id)}
                      onDragOver={handleDragOverReview}
                      onDrop={(e) => handleDropReview(e, file.id)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center p-3 cursor-pointer transition-all duration-200 ${
                        draggedItem === file.id ? 'opacity-50 scale-95 shadow-lg' : 
                        selectedFileForPreview?.id === file.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500 shadow-md' :
                        'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {/* File Order Number */}
                      <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 mr-3">
                        {index + 1}
                      </div>
                      
                      {/* File Type Icon */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white mr-3 ${
                        file.type.startsWith('video/') ? 'bg-purple-500' :
                        file.type.startsWith('image/') ? 'bg-green-500' :
                        file.type.includes('pdf') ? 'bg-red-500' :
                        file.type.includes('excel') || file.type.includes('spreadsheet') ? 'bg-green-600' :
                        file.type.includes('word') || file.type.includes('document') ? 'bg-blue-500' :
                        file.type.includes('csv') ? 'bg-green-500' :
                        'bg-gray-400'
                      }`}>
                        <FontAwesomeIcon 
                          icon={getFileIcon(file.type)} 
                          className="w-5 h-5" 
                        />
                      </div>
                      
                      {/* File Metadata */}
                      <div className="flex-1 min-w-0 mr-3">
                        <div className="font-medium text-gray-900 dark:text-white truncate text-sm mb-0.5">{file.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                          <span className="capitalize">{file.type.split('/')[0]}</span>
                        </div>
                      </div>
                      
                      {/* Source Icon */}
                      <div className="flex items-center gap-2 mr-3">
                        <FontAwesomeIcon 
                          icon={faDesktop} 
                          className="w-4 h-4 text-blue-500" 
                          title="Local file"
                        />
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="flex items-center gap-2 mr-3">
                        <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Ready</span>
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => {
                          if (selectedFileForPreview?.id === file.id) {
                            setSelectedFileForPreview(null);
                          } else {
                            handleFileSelect(file);
                          }
                        }}
                        className={`p-1.5 rounded-md transition-all duration-200 ${
                          selectedFileForPreview?.id === file.id 
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                        title={selectedFileForPreview?.id === file.id ? 'Collapse' : 'Expand'}
                      >
                        <FontAwesomeIcon 
                          icon={selectedFileForPreview?.id === file.id ? faChevronUp : faChevronDown} 
                          className="w-3.5 h-3.5" 
                        />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ml-1"
                        title="Delete file"
                      >
                        <FontAwesomeIcon icon={faTrash} className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Expanded Content - Additional Metadata and Preview */}
                    {selectedFileForPreview?.id === file.id && (
                      <div className="border-t border-gray-200 dark:border-gray-600 p-4 bg-white dark:bg-gray-800">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Side - Additional Metadata */}
                          <div className="space-y-3">
                            <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Configuration Preview</h4>
                            
                            {/* Process Name */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                              <input
                                type="text"
                                value={processName || 'Marketing Data Analysis'}
                                onChange={(e) => setProcessName(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="Enter process name"
                              />
                            </div>

                            {/* Context */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sub Process Context</label>
                              <textarea
                                rows={2}
                                value={processDescription || 'Analyze key performance...'}
                                onChange={(e) => setProcessDescription(e.target.value)}
                                className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                                placeholder="Enter sub process context"
                              />
                            </div>

                            {/* Tags */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Tags</label>
                              <div className="flex flex-wrap gap-1.5">
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                                  Marketing
                                  <button className="ml-1 text-purple-500 hover:text-purple-700 dark:hover:text-purple-200">
                                    <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs">
                                  Q4
                                  <button className="ml-1 text-purple-500 hover:text-purple-700 dark:hover:text-purple-200">
                                    <FontAwesomeIcon icon={faTimes} className="w-2.5 h-2.5" />
                                  </button>
                                </span>
                                <button className="px-2 py-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 text-xs">
                                  + Add tag
                                </button>
                              </div>
                            </div>

                            {/* Dependencies */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Dependencies</label>
                              <select multiple className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[80px]">
                                {uploadedFiles.map((file, idx) => (
                                  <option key={file.id} value={file.id}>
                                    {file.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Process Owner */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Sub Process Owner</label>
                              <select className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option>Bob Williams</option>
                                <option>Jane Doe</option>
                                <option>John Smith</option>
                              </select>
                            </div>

                            {/* Assignment Group */}
                            <div>
                              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">Assignment Group</label>
                              <select className="w-full px-2.5 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option>Select assignment group</option>
                                <option>Marketing Team</option>
                                <option>Data Team</option>
                                <option>Analytics Team</option>
                              </select>
                            </div>
                          </div>

                          {/* Right Side - File Preview */}
                          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">File Preview</h4>
                            <div className="h-64 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
                              {renderFilePreview(file)}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <FontAwesomeIcon icon={faUpload} className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm font-medium mb-1">No files uploaded yet</p>
                  <p className="text-xs">Upload files above to see them here</p>
                </div>
              )}
            </div>
              
              {/* Overall Context and Default Assignment Group - Above Processing Summary */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="">
                    {/* Overall Context */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overall Context</label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        placeholder="Enter overall context for the entire process..."
                      />
                    </div>

                    {/* Default Assignment Group */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Default Assignment Group</label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                        <option>Select default assignment group</option>
                        <option>Marketing Team</option>
                        <option>Data Team</option>
                        <option>Analytics Team</option>
                        <option>Operations Team</option>
                        <option>Support Team</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
              
              {/* File Processing Summary */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Processing Summary</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Ready for ingestion</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Total files:</span>
                      <span className="font-medium">{uploadedFiles.length}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">Total size:</span>
                      <span className="font-medium">
                        {uploadedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024) < 1 ? 
                          `${(uploadedFiles.reduce((acc, file) => acc + file.size, 0) / 1024).toFixed(1)} KB` : 
                          `${(uploadedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024)).toFixed(1)} MB`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Review Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleBack}
                  className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2 text-sm"
                >
                  <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
                  Back to Setup
                </button>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium text-sm"
                  >
                    Save Configuration
                  </button>
                  <button
                    onClick={handleStartIngestion}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2 text-sm"
                  >
                    <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5" />
                    Start Ingestion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <AddToolIntegrationModal 
          open={showAddIntegrationModal} 
          onClose={handleCloseModal}
          selectedTool={selectedTool}
        />
      </div>
    );
  };

export default AddProcess
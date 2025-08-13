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
  faCog, faLink, faCloud, faSquare, faTimes, faGripVertical
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
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [selectedFileForPreview, setSelectedFileForPreview] = useState<UploadedFile | null>(null);
  const [currentStep, setCurrentStep] = useState<'setup' | 'review'>('setup');

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
    if (fileType.startsWith('video/')) return faVideo;
    if (fileType.startsWith('image/')) return faImage;
    if (fileType.includes('pdf')) return faFileAlt;
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return faFileAlt;
    if (fileType.includes('word') || fileType.includes('document')) return faFileAlt;
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
    console.log('Starting ingestion with files:', uploadedFiles);
    // Here you would typically start the ingestion process
    alert('Data ingestion started successfully!');
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Review Input Data</h2>
              <p className="text-base text-gray-600 dark:text-gray-400">Review and verify the data files that will be processed for mining.</p>
            </div>
            
            <div className="flex gap-8">
              {/* Left Pane - File List */}
              <div className="w-2/5">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                  <FontAwesomeIcon icon={faGripVertical} className="w-4 h-4 text-gray-400" />
                  Review Your Data
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    (Drag to reorder)
                  </span>
                </h3>
                <div className="space-y-3">
                  {uploadedFiles.length > 0 ? (
                    uploadedFiles.map((file, index) => (
                      <div 
                        key={file.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, file.id)}
                        onDragOver={handleDragOverReview}
                        onDrop={(e) => handleDropReview(e, file.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleFileSelect(file)}
                        className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                          draggedItem === file.id ? 'opacity-50 scale-95 shadow-lg' : 
                          selectedFileForPreview?.id === file.id ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500 shadow-md' :
                          'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500'
                        }`}
                      >
                        {/* Drag Handle */}
                        <div className="text-gray-400 dark:text-gray-500 cursor-move hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                          <FontAwesomeIcon icon={faGripVertical} className="w-5 h-5" />
                        </div>
                        
                        {/* File Type Icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                          file.type.startsWith('video/') ? 'bg-purple-500' :
                          file.type.startsWith('image/') ? 'bg-green-500' :
                          file.type.includes('pdf') ? 'bg-red-500' :
                          file.type.includes('excel') || file.type.includes('spreadsheet') ? 'bg-green-600' :
                          file.type.includes('word') || file.type.includes('document') ? 'bg-blue-500' :
                          'bg-gray-400'
                        }`}>
                          {file.type.startsWith('video/') ? 'VID' :
                           file.type.startsWith('image/') ? 'IMG' :
                           file.type.includes('pdf') ? 'PDF' :
                           file.type.includes('excel') || file.type.includes('spreadsheet') ? 'XL' :
                           file.type.includes('word') || file.type.includes('document') ? 'WD' :
                           'FILE'}
                        </div>
                        
                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white truncate text-base">{file.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{formatFileSize(file.size)}</div>
                        </div>
                        
                        {/* Status Icon */}
                        <div className="text-gray-400 dark:text-gray-500">
                          <FontAwesomeIcon icon={faCloud} className="w-4 h-4" />
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                          title="Delete file"
                        >
                          <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                      <FontAwesomeIcon icon={faUpload} className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p className="text-base font-medium mb-1">No files uploaded yet</p>
                      <p className="text-sm">Upload files above to see them here</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Right Pane - Preview */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                {selectedFileForPreview ? (
                  <div className="h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Preview: {selectedFileForPreview.name}
                      </h4>
                      <button
                        onClick={() => setSelectedFileForPreview(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="h-[calc(100%-3rem)]">
                      {renderFilePreview(selectedFileForPreview)}
                    </div>
                  </div>
                ) : uploadedFiles.length > 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                    <FontAwesomeIcon icon={faFileAlt} className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium mb-2">Select a file to preview</p>
                    <p className="text-base text-gray-400 dark:text-gray-500">Click on any file in the list to view its preview</p>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-16">
                    <FontAwesomeIcon icon={faFileAlt} className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium mb-2">No files uploaded yet</p>
                    <p className="text-base text-gray-400 dark:text-gray-500">Upload files above to see them here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Review Action Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleBack}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Back
              </button>
              <div className="flex space-x-4">
                <button
                  onClick={handleSave}
                  className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                >
                  Save
                </button>
                <button
                  onClick={handleStartIngestion}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
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

export default AddProcess; 
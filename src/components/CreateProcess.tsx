import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faHeadset, faEnvelope, faUsers, faPlus, faLaptop, faTimes, faCheck, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface DataSourceTab {
  label: string;
  icon: any;
}

interface AcceptedFileTypes {
  [key: string]: string[];
}

const dataSourceTabs: DataSourceTab[] = [
  { label: "Manual Upload", icon: faUpload },
  { label: "Service Desk", icon: faHeadset },
  { label: "Email", icon: faEnvelope },
  { label: "Teams", icon: faUsers },
];

const ACCEPTED_FILE_TYPES: AcceptedFileTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/gif': ['.gif'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/x-ms-wmv': ['.wmv'],
  'application/pdf': ['.pdf']
};

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export default function CreateProcess() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dataSourceUrl, setDataSourceUrl] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const validateFile = (file: File): boolean => {
    if (!file) return false;
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size should be less than 100MB");
      return false;
    }

    // Check file type
    const fileType = file.type.toLowerCase();
    const isValidType = Object.keys(ACCEPTED_FILE_TYPES).some(type => fileType === type);
    
    if (!isValidType) {
      const acceptedTypes = Object.values(ACCEPTED_FILE_TYPES)
        .flat()
        .map(ext => ext.toUpperCase())
        .join(', ');
      setFileError(`Please upload only these file types: ${acceptedTypes}`);
      return false;
    }

    setFileError("");
    return true;
  };

  const handleUploadClick = (): void => {
    // Directly trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setFileError("");
    setPreviewUrl(null);
    
    // Log file details for debugging
    console.log('Selected file:', {
      name: selectedFile.name,
      type: selectedFile.type,
      size: selectedFile.size
    });
    
    // Validate file
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      // Create preview URL for images and videos
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      }
      // Simulate upload progress
      simulateUpload();
    }
  };

  const simulateUpload = (): void => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const clearFile = (): void => {
    setFile(null);
    setFileError("");
    setPreviewUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = (): any => {
    // Always return laptop icon for local files
    return faLaptop;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a process title');
      return;
    }
    
    if (!file && !dataSourceUrl.trim()) {
      alert('Please either upload a file or provide a data source URL');
      return;
    }

    // Show ingestion confirmation
    const confirmIngestion = window.confirm('Start data ingestion process?');
    if (!confirmIngestion) return;

    // Create new process object with exact structure matching ProcessListing
    const newProcess = {
      id: Date.now(),
      created: new Date().toISOString().split('T')[0],
      transcription: '0/3',
      status: 'IN PROGRESS',
      statusColor: 'bg-blue-600',
      title: title.trim(),
      description: description.trim() || `Process created from ${file ? 'local file upload' : 'data source URL'}.`,
    };

    try {
      // Get existing processes from localStorage
      const existingProcesses = JSON.parse(localStorage.getItem('processes') || '[]');
      
      // Add new process to the list
      const updatedProcesses = [...existingProcesses, newProcess];
      
      // Save to localStorage
      localStorage.setItem('processes', JSON.stringify(updatedProcesses));

      // Show success message
      alert('Ingestion process started successfully!');
      
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

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        if (droppedFile.type.startsWith('image/') || droppedFile.type.startsWith('video/')) {
          const url = URL.createObjectURL(droppedFile);
          setPreviewUrl(url);
        }
        simulateUpload();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Process</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up a new process by providing the necessary information and data source.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Process Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Process Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Process Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter process title"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the process"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Enter tags separated by commas"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Data Source */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Data Source</h2>
            
            {/* Tabs */}
            <div className="flex space-x-1 mb-6">
              {dataSourceTabs.map((tab, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === index
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
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <FontAwesomeIcon icon={getFileIcon()} className="w-12 h-12 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                  {isUploading && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <FontAwesomeIcon icon={faUpload} className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Supported formats: JPG, PNG, GIF, MP4, MOV, AVI, WMV, PDF (max 100MB)
                  </p>
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} className="w-4 h-4 mr-2" />
                    Browse Files
                  </button>
                </div>
              )}
              
              {fileError && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 mr-2" />
                    <span className="text-red-700 dark:text-red-300 text-sm">{fileError}</span>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,video/*,.pdf"
            />

            {/* Data Source URL */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Data Source URL (Optional)
              </label>
              <input
                type="url"
                value={dataSourceUrl}
                onChange={(e) => setDataSourceUrl(e.target.value)}
                placeholder="https://example.com/data.json"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="max-w-md">
                {file?.type.startsWith('image/') ? (
                  <img src={previewUrl} alt="Preview" className="w-full rounded-lg" />
                ) : file?.type.startsWith('video/') ? (
                  <video src={previewUrl} controls className="w-full rounded-lg" />
                ) : null}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/process')}
              className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2" />
                  Create Process
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
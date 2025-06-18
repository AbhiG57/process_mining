import React, { useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faHeadset, faEnvelope, faUsers, faPlus, faFile, faFileImage, faFileVideo, faFilePdf, faTimes, faCheck, faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const dataSourceTabs = [
  { label: "Manual Upload", icon: faUpload },
  { label: "Service Desk", icon: faHeadset },
  { label: "Email", icon: faEnvelope },
  { label: "Teams", icon: faUsers },
];

const ACCEPTED_FILE_TYPES = {
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
  const [activeTab, setActiveTab] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dataSourceUrl, setDataSourceUrl] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const validateFile = (file) => {
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

  const handleUploadClick = () => {
    // Directly trigger the file input click
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
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

  const simulateUpload = () => {
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

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setFileError("");
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const getFileIcon = () => {
    if (!file) return faFile;
    if (file.type.startsWith('image/')) return faFileImage;
    if (file.type.startsWith('video/')) return faFileVideo;
    if (file.type === 'application/pdf') return faFilePdf;
    return faFile;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !description) {
      alert("Please fill in all required fields");
      return;
    }

    if (activeTab === 0 && !file && !dataSourceUrl) {
      setFileError("Please either upload a file or provide a data source URL");
      return;
    }
    
    // Create new process object
    const newProcess = {
      id: Date.now(),
      created: new Date().toISOString().split('T')[0],
      transcription: '0/0',
      status: 'IN REVIEW',
      statusColor: 'bg-yellow-600',
      title: title,
      description: description,
      dataSourceUrl: dataSourceUrl,
      tags: tags.split(',').map(tag => tag.trim()),
      file: file ? {
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified
      } : null
    };

    // Get existing processes from localStorage
    const existingProcesses = JSON.parse(localStorage.getItem('processes') || '[]');
    
    // Add new process to the list
    const updatedProcesses = [...existingProcesses, newProcess];
    
    // Save updated processes list
    localStorage.setItem('processes', JSON.stringify(updatedProcesses));

    // Redirect to process listing page
    // navigate('/process');
    navigate('/process/1');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Configure New Process</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="flex gap-6 mb-6">
            <div className="flex-1">
              <label className="block font-semibold mb-2">Process Title *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Enter a descriptive title for the process"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-2">Description *</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Enter a description of the process"
                required
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="text-lg font-semibold mb-4">
              Data Source Configuration 
              <span className="text-gray-500 dark:text-gray-400 font-normal ml-4 cursor-pointer">
                <FontAwesomeIcon icon={faPlus} /> New
              </span>
            </div>
            
            <div className="flex gap-8 border-b-2 border-gray-200 dark:border-gray-700 mb-6">
              {dataSourceTabs.map((tab, idx) => (
                <div
                  key={tab.label}
                  onClick={() => setActiveTab(idx)}
                  className={`cursor-pointer pb-3 flex flex-col items-center min-w-[100px] ${
                    activeTab === idx 
                      ? 'border-b-3 border-white text-white' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} className="text-xl mb-1" />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </div>
              ))}
            </div>
          </div>

          {activeTab === 0 && (
            <>
              <div className="mb-6">
                <label className="block font-semibold mb-2">Data Source Link URL</label>
                <div className="relative">
                  <input
                    type="url"
                    value={dataSourceUrl}
                    onChange={e => setDataSourceUrl(e.target.value)}
                    placeholder="Enter the URL of the data source"
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
                  />
                  {dataSourceUrl && (
                    <button
                      type="button"
                      onClick={() => setDataSourceUrl("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center text-gray-500 dark:text-gray-400 my-6 font-semibold">OR</div>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center mb-8 transition-all ${
                  isDragging 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                    : 'border-gray-300 dark:border-gray-700'
                }`}
              >
                {!file ? (
                  <>
                    <div className="text-xl font-bold mb-2">Drag and drop files here</div>
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                      Or click to browse. Supported types: images (PNG, JPG, GIF), videos (MP4, MOV, AVI), PDF
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileChange}
                      accept={Object.keys(ACCEPTED_FILE_TYPES).join(',')}
                    />
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faUpload} />
                      Upload File
                    </button>
                  </>
                ) : (
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={getFileIcon()} className="text-2xl text-green-500" />
                        <div>
                          <div className="font-semibold mb-1">{file.name}</div>
                          <div className="text-gray-500 dark:text-gray-400 text-sm">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearFile}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                    
                    {isUploading && (
                      <div className="mb-4">
                        <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>Uploading... {uploadProgress}%</span>
                          <FontAwesomeIcon icon={faSpinner} spin />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mb-8">
            <label className="block font-semibold mb-2">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Enter tags for process (comma-separated)"
              className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-10 py-3.5 rounded-xl font-bold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Create Process
          </button>
        </form>
      </div>
    </div>
  );
} 
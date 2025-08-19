import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faFileVideo,
  faFileAlt,
  faCheck,
  faHourglassHalf,
  faTimes,
  faExclamationTriangle,
  faCloud,
  faDesktop,
  faDownload,
  faPlay,
  faPause,
  faStop
} from '@fortawesome/free-solid-svg-icons';

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'image' | 'video' | 'other';
  size: number;
  source: 'local' | 'google-drive' | 'dropbox';
  sourcePath?: string;
  status: 'processing' | 'ready' | 'failed' | 'warning';
  progress?: number;
  message?: string;
  uploadedAt: string;
  fileSize: string;
}

const DataExtractionProcess: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);

  // Sample data - in real app this would come from API/props
  const files: FileItem[] = [
    {
      id: '1',
      name: 'Document_2024-01-15.pdf',
      type: 'pdf',
      size: 2.1,
      source: 'local',
      status: 'processing',
      progress: 65,
      message: 'Extracting text...',
      uploadedAt: '10:15 AM',
      fileSize: '2.1 MB'
    },
    {
      id: '2',
      name: 'Presentation_Q4_2023.pptx',
      type: 'doc',
      size: 1.5,
      source: 'local',
      status: 'ready',
      uploadedAt: '10:16 AM',
      fileSize: '1.5 MB'
    },
    {
      id: '3',
      name: 'Image_2024-01-15.jpg',
      type: 'image',
      size: 3.2,
      source: 'local',
      status: 'ready',
      uploadedAt: '10:17 AM',
      fileSize: '3.2 MB'
    },
    {
      id: '4',
      name: 'Video_2024-01-15.mp4',
      type: 'video',
      size: 4.8,
      source: 'local',
      status: 'ready',
      uploadedAt: '10:18 AM',
      fileSize: '4.8 MB'
    },
    {
      id: '5',
      name: 'Spreadsheet_2024-01-15.xlsx',
      type: 'xls',
      size: 1.2,
      source: 'local',
      status: 'warning',
      message: 'Missing optional column: owner_id',
      uploadedAt: '10:19 AM',
      fileSize: '1.2 MB'
    },
    {
      id: '6',
      name: 'Report_Q3_2023.docx',
      type: 'doc',
      size: 2.5,
      source: 'google-drive',
      sourcePath: '/Reports/Q3',
      status: 'ready',
      uploadedAt: '10:20 AM',
      fileSize: '2.5 MB'
    },
    {
      id: '7',
      name: 'Campaign_Analysis_2023.pdf',
      type: 'pdf',
      size: 3.7,
      source: 'google-drive',
      sourcePath: '/Marketing/Campaigns',
      status: 'failed',
      message: 'File corrupted',
      uploadedAt: '10:21 AM',
      fileSize: '3.7 MB'
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return faFilePdf;
      case 'doc': return faFileWord;
      case 'xls': return faFileExcel;
      case 'image': return faFileImage;
      case 'video': return faFileVideo;
      default: return faFileAlt;
    }
  };

  const getFileIconColor = (type: string) => {
    switch (type) {
      case 'pdf': return 'bg-red-500';
      case 'doc': return 'bg-blue-500';
      case 'xls': return 'bg-green-500';
      case 'image': return 'bg-purple-500';
      case 'video': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />;
      case 'processing': return <FontAwesomeIcon icon={faHourglassHalf} className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed': return <FontAwesomeIcon icon={faTimes} className="w-4 h-4 text-red-500" />;
      case 'warning': return <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-500';
      case 'processing': return 'text-blue-500';
      case 'failed': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'local': return faDesktop;
      case 'google-drive': return faCloud;
      default: return faCloud;
    }
  };

  const getSourceText = (source: string, sourcePath?: string) => {
    switch (source) {
      case 'local': return 'Uploaded from device';
      case 'google-drive': return `Pulled from Google Drive ${sourcePath}`;
      default: return 'External source';
    }
  };

  const completedFiles = files.filter(f => f.status === 'ready').length;
  const processingFiles = files.filter(f => f.status === 'processing').length;
  const failedFiles = files.filter(f => f.status === 'failed').length;
  const totalFiles = files.length;

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Data Extraction
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Processing uploaded and linked files in the background. Live status below.
            </p>
          </div>
          
          {/* Control Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                isPaused 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} className="w-3 h-3 mr-1.5" />
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button className="px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md text-sm font-medium transition-all duration-200">
              <FontAwesomeIcon icon={faStop} className="w-3 h-3 mr-1.5" />
              Stop
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">Progress</span>
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {completedFiles}/{totalFiles}
              </span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-700 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(completedFiles / totalFiles) * 100}%` }}
              />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              files processed
            </p>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Status</span>
              <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-gray-500 dark:text-gray-400" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                  <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                  Completed
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{completedFiles}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <FontAwesomeIcon icon={faHourglassHalf} className="w-3 h-3" />
                  Processing
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{processingFiles}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                  <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                  Failed
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">{failedFiles}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Lists */}
      <div className="space-y-4">
        {/* Local Uploads */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
              <FontAwesomeIcon icon={faDesktop} className="w-4 h-4 mr-2 text-blue-500" />
              Local Uploads ({files.filter(f => f.source === 'local').length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {files.filter(f => f.source === 'local').map((file) => (
              <div key={file.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  {/* File Icon */}
                  <div className={`w-10 h-10 rounded-lg ${getFileIconColor(file.type)} flex items-center justify-center flex-shrink-0`}>
                    <FontAwesomeIcon icon={getFileIcon(file.type)} className="w-5 h-5 text-white" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">{file.name}</h4>
                      {getStatusIcon(file.status)}
                    </div>
                    <p className={`text-xs font-medium ${getStatusColor(file.status)} mb-0.5`}>
                      {file.message || (file.status === 'ready' ? 'Ready' : 'Processing...')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getSourceText(file.source)} • {file.fileSize} • {file.uploadedAt}
                    </p>
                  </div>

                  {/* Progress/Status */}
                  <div className="flex items-center space-x-2">
                    {file.status === 'processing' && file.progress && (
                      <div className="flex items-center space-x-1.5">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400 w-6">
                          {file.progress}%
                        </span>
                      </div>
                    )}
                    {file.status === 'ready' && (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    )}
                    {file.status === 'failed' && (
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    )}
                    {file.status === 'warning' && (
                      <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Drive */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
              <FontAwesomeIcon icon={faCloud} className="w-4 h-4 mr-2 text-green-500" />
              Google Drive ({files.filter(f => f.source === 'google-drive').length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {files.filter(f => f.source === 'google-drive').map((file) => (
              <div key={file.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-3">
                  {/* File Icon */}
                  <div className={`w-10 h-10 rounded-lg ${getFileIconColor(file.type)} flex items-center justify-center flex-shrink-0`}>
                    <FontAwesomeIcon icon={getFileIcon(file.type)} className="w-5 h-5 text-white" />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate text-sm">{file.name}</h4>
                      {getStatusIcon(file.status)}
                    </div>
                    <p className={`text-xs font-medium ${getStatusColor(file.status)} mb-0.5`}>
                      {file.message || (file.status === 'ready' ? 'Ready' : 'Processing...')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getSourceText(file.source, file.sourcePath)} • {file.fileSize} • {file.uploadedAt}
                    </p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center space-x-2">
                    {file.status === 'ready' && (
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    )}
                    {file.status === 'failed' && (
                      <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataExtractionProcess;

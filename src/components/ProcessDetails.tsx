import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faCheck,
  faCircle,
  faPlay,
  faPause,
  faStop,
  faEye,
  faEdit,
  faDownload,
  faShare,
  faEllipsisV,
  faUser,
  faClock,
  faCode
} from '@fortawesome/free-solid-svg-icons';
import ProcessDraft from './ProcessDraft';
import DataExtractionProcess from './DataExtractionProcess';
import { useNavigate } from 'react-router-dom';

interface ProcessStage {
  id: string;
  name: string;
  status: 'completed' | 'current' | 'upcoming' | 'error';
  description: string;
  icon: any;
}

const ProcessDetails: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<string>('data-extraction');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const navigate = useNavigate();

  const stages: ProcessStage[] = [
    {
      id: 'draft',
      name: 'Draft',
      status: 'completed',
      description: 'Configure process settings and data sources',
      icon: faEdit
    },
    {
      id: 'data-extraction',
      name: 'Data Extraction',
      status: 'current',
      description: 'Extract and process data from sources',
      icon: faDownload
    },
    {
      id: 'review',
      name: 'Review',
      status: 'upcoming',
      description: 'Review and validate results',
      icon: faEye
    },
    {
      id: 'wfbuilder',
      name: 'Workflow Builder',
      status: 'upcoming',
      description: 'Build and test your workflow',
      icon: faCode
    },
    {
      id: 'complete',
      name: 'Complete',
      status: 'upcoming',
      description: 'Process completed successfully',
      icon: faCheck
    }
  ];

  const getStageStatusIcon = (stage: ProcessStage) => {
    switch (stage.status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-500" />;
      case 'current':
        return <FontAwesomeIcon icon={faCircle} className="w-4 h-4 text-blue-500" />;
      case 'upcoming':
        return <FontAwesomeIcon icon={faCircle} className="w-4 h-4 text-gray-300" />;
      case 'error':
        return <FontAwesomeIcon icon={faCircle} className="w-4 h-4 text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faCircle} className="w-4 h-4 text-gray-300" />;
    }
  };

  const getStageStatusClass = (stage: ProcessStage) => {
    switch (stage.status) {
      case 'completed':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
      case 'current':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
      case 'upcoming':
        return 'text-gray-500 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
    }
  };

  const handleStageClick = (stageId: string) => {
    // Only allow navigation to completed stages or current stage
    const stage = stages.find(s => s.id === stageId);
    if (stage && (stage.status === 'completed' || stage.status === 'current')) {
      setCurrentStage(stageId);
    }
  };

  const handleRunProcess = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePauseProcess = () => {
    setIsPaused(!isPaused);
  };

  const handleStopProcess = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const renderStageContent = () => {
    switch (currentStage) {
      case 'draft':
        return <ProcessDraft />;
      case 'data-extraction':
        return <DataExtractionProcess />;
      default:
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <FontAwesomeIcon icon={faCircle} className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{stages.find(s => s.id === currentStage)?.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                This stage is not yet implemented.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Process Info Header Strip */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1">
            {/* Process Name */}
            <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faChevronLeft} className="w-5 h-5" />
              </button>
              <h4 className="font-semibold text-gray-900 dark:text-white">Customer Onboarding Process</h4>
            </div>

            {/* User Info and Timestamp */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
                <span>John Doe</span>
              </div>
              <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                <span>2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise-Level Stepper */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center flex-1">
                {/* Stage Circle */}
                <button
                  onClick={() => handleStageClick(stage.id)}
                  disabled={stage.status === 'upcoming'}
                  className={`group relative flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    stage.status === 'completed' || stage.status === 'current'
                      ? 'cursor-pointer hover:scale-110 hover:shadow-lg'
                      : 'cursor-not-allowed opacity-50'
                  } ${
                    stage.status === 'completed' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                    stage.status === 'current' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                    stage.status === 'error' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                    'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700'
                  }`}
                >
                  {getStageStatusIcon(stage)}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                    {stage.description}
                  </div>
                </button>

                {/* Stage Label */}
                <div className="ml-2 min-w-0">
                  <h3 className={`text-xs font-semibold truncate ${
                    stage.status === 'current' ? 'text-blue-600 dark:text-blue-400' :
                    stage.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                    stage.status === 'error' ? 'text-red-600 dark:text-red-400' :
                    'text-gray-500 dark:text-gray-400'
                  }`}>
                    {stage.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {stage.description}
                  </p>
                </div>

                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div className={`h-0.5 rounded-full transition-all duration-300 ${
                      stage.status === 'completed' ? 'bg-green-300 dark:bg-green-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {renderStageContent()}
      </div>
    </div>
  );
};

export default ProcessDetails;

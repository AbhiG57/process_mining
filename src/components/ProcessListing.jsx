import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faEdit, faCopy, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// Hardcoded default processes
const defaultProcesses = [
  {
    id: 1,
    created: '2024-01-15',
    transcription: '2/3',
    status: 'IN REVIEW',
    statusColor: 'bg-yellow-600',
    title: 'Shopping on Amazon',
    description:
      'The user either logs into their existing Amazon account or creates a new one',
  },
  {
    id: 2,
    created: '2024-01-15',
    transcription: '2/3',
    status: 'COMPLETED',
    statusColor: 'bg-green-700',
    title: 'Data Entry Automation',
    description:
      'Automates data entry tasks, reducing manual effort and errors. Automates data entry tasks, reducing manual effort and errors. Automates data entry tasks, reducing manual effort and errors.',
  },
  {
    id: 3,
    created: '2024-01-15',
    transcription: '2/3',
    status: 'IN PROGRESS',
    statusColor: 'bg-blue-700',
    title: 'Customer Onboarding',
    description:
      'Automates data entry tasks, reducing manual effort and errors. Automates data entry tasks, reducing manual effort and errors. Automates data entry tasks, reducing manual effort and errors.',
  },
];

const statusCards = [
  { label: 'Active', value: 12 },
  { label: 'Executing', value: 5 },
  { label: 'Inactive', value: 7 },
];

function ProcessListing() {
  const navigate = useNavigate();
  const [processes, setProcesses] = useState(defaultProcesses);

  useEffect(() => {
    // Load additional processes from localStorage on component mount
    const storedProcesses = JSON.parse(localStorage.getItem('processes') || '[]');
    // Combine default processes with stored processes, avoiding duplicates
    const combinedProcesses = [...defaultProcesses];
    storedProcesses.forEach(storedProcess => {
      if (!defaultProcesses.some(dp => dp.id === storedProcess.id)) {
        combinedProcesses.push(storedProcess);
      }
    });
    setProcesses(combinedProcesses);
  }, []);

  const handleDeleteProcess = (processId) => {
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

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white px-8 py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Processes</h1>
        <button onClick={() => navigate(`/createProcess`)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow transition-colors" >
          <FontAwesomeIcon icon={faPlus} />
          Create Process
        </button>
      </div>
      <div className="flex gap-6 mb-10">
        {statusCards.map((card) => (
          <div
            key={card.label}
            className="flex-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-6 text-center"
          >
            <div className="text-2xl font-semibold mb-2">{card.value}</div>
            <div className="text-gray-500 dark:text-gray-300">{card.label}</div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-semibold mb-4">All Processes</h2>
      <div className="flex flex-col gap-6">
        {processes.map((process) => (
          <div
            key={process.id}
            className="rounded-xl bg-gray-100 dark:bg-gray-800 p-6 shadow border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/process/${process.id}`)}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div className="text-gray-500 dark:text-gray-400 text-sm mb-2 md:mb-0">
                Created: {process.created} | Transcription: {process.transcription}
              </div>
              <span
                className={`inline-block px-3 py-1 text-xs font-bold rounded-full text-white ${process.statusColor}`}
              >
                {process.status}
              </span>
            </div>
            <div className="text-lg font-bold mb-1">{process.title}</div>
            <div className="text-gray-700 dark:text-gray-300 mb-4 text-sm">{process.description}</div>
            <div className="flex items-center gap-3">
              <button className="bg-gray-200 dark:bg-gray-700 px-4 py-1 rounded text-sm font-medium text-gray-900 dark:text-white">Test</button>
              <div className="flex-1" />
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white">
                <FontAwesomeIcon icon={faToggleOn} size="lg" />
              </button>
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white">
                <FontAwesomeIcon icon={faEdit} size="lg" />
              </button>
              <button className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-white">
                <FontAwesomeIcon icon={faCopy} size="lg" />
              </button>
              {!defaultProcesses.some(dp => dp.id === process.id) && (
                <button 
                  className="text-gray-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProcess(process.id);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} size="lg" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProcessListing; 
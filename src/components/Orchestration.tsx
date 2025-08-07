import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHourglassHalf, faExclamationCircle, faUser, faClock, faStop, faExclamationTriangle, faSpinner, faBoxOpen, faTruck, faWarehouse, faClipboardList, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

interface Task {
  name: string;
  status: 'completed' | 'inprogress' | 'pending' | 'error' | 'none';
  description: string;
}

interface Stage {
  name: string;
  icon: any;
  color: string;
  tasks: Task[];
}

interface Workflow {
  orderNumber: string;
  eta: string;
  orderDate: string;
  progress: number;
  stages: Stage[];
  logs: string[];
  selectedTask: {
    stageIdx: number;
    taskIdx: number;
  };
}

interface Ticket {
  id: string;
  customer: string;
  status: 'open' | 'closed';
  liked: boolean;
  workflow: Workflow;
}

interface StatusConfig {
  label: string;
  color: string;
  icon: any;
  bg: string;
  text: string;
}

const ORCHESTRATION_DATA: Ticket[] = [
  {
    id: '4321',
    customer: 'John Doe',
    status: 'open',
    liked: false,
    workflow: {
      orderNumber: '56789',
      eta: '2024-03-10',
      orderDate: '2024-03-05',
      progress: 60,
      stages: [
        {
          name: 'Order Received',
          icon: faBoxOpen,
          color: 'blue',
          tasks: [
            { name: 'Verify Order Details', status: 'completed', description: 'Check for completeness' },
          ],
        },
        {
          name: 'Payment Processing',
          icon: faWarehouse,
          color: 'blue',
          tasks: [
            { name: 'Authorize Payment', status: 'inprogress', description: 'Connect to payment gateway' },
            { name: 'Confirm Payment', status: 'pending', description: 'Record transaction ID' },
          ],
        },
        {
          name: 'Inventory Check',
          icon: faWarehouse,
          color: 'yellow',
          tasks: [
            { name: 'Check Stock Levels', status: 'pending', description: 'Ensure items are available' },
          ],
        },
        {
          name: 'Shipment Preparation',
          icon: faTruck,
          color: 'red',
          tasks: [
            { name: 'Print Shipping Label', status: 'error', description: 'Printer offline' },
          ],
        },
      ],
      logs: [
        '[10:05:12] Task initiated by workflow engine.',
        '[10:05:15] Connecting to payment gateway API...',
        '[10:05:20] API connection successful.',
        '[10:05:22] Submitting payment authorization request for $49.99.',
        '[10:05:30] Awaiting response from gateway...'
      ],
      selectedTask: { stageIdx: 1, taskIdx: 0 },
    },
  },
  {
    id: '4322',
    customer: 'Jane Smith',
    status: 'closed',
    liked: false,
    workflow: {
      orderNumber: '56800',
      eta: '2024-03-12',
      orderDate: '2024-03-06',
      progress: 100,
      stages: [
        {
          name: 'Order Received',
          icon: faBoxOpen,
          color: 'blue',
          tasks: [
            { name: 'Verify Order Details', status: 'completed', description: 'Check for completeness' },
          ],
        },
        {
          name: 'Payment Processing',
          icon: faWarehouse,
          color: 'blue',
          tasks: [
            { name: 'Authorize Payment', status: 'completed', description: 'Connect to payment gateway' },
            { name: 'Confirm Payment', status: 'completed', description: 'Record transaction ID' },
          ],
        },
        {
          name: 'Inventory Check',
          icon: faWarehouse,
          color: 'yellow',
          tasks: [
            { name: 'Check Stock Levels', status: 'completed', description: 'Ensure items are available' },
          ],
        },
        {
          name: 'Shipment Preparation',
          icon: faTruck,
          color: 'red',
          tasks: [
            { name: 'Print Shipping Label', status: 'completed', description: 'Printer offline' },
          ],
        },
      ],
      logs: [
        '[10:05:12] Task completed.'
      ],
      selectedTask: { stageIdx: 0, taskIdx: 0 },
    },
  },
];

const STATUS_MAP: Record<string, StatusConfig> = {
  completed: {
    label: 'COMPLETED',
    color: 'green',
    icon: faCheckCircle,
    bg: 'bg-green-100 dark:bg-green-900',
    text: 'text-green-700 dark:text-green-300',
  },
  inprogress: {
    label: 'IN PROGRESS',
    color: 'blue',
    icon: faHourglassHalf,
    bg: 'bg-blue-100 dark:bg-blue-900',
    text: 'text-blue-700 dark:text-blue-300',
  },
  pending: {
    label: 'PENDING',
    color: 'yellow',
    icon: faHourglassHalf,
    bg: 'bg-yellow-100 dark:bg-yellow-900',
    text: 'text-yellow-700 dark:text-yellow-300',
  },
  error: {
    label: 'ERROR',
    color: 'red',
    icon: faExclamationCircle,
    bg: 'bg-red-100 dark:bg-red-900',
    text: 'text-red-700 dark:text-red-300',
  },
  none: {
    label: '',
    color: '',
    icon: null,
    bg: '',
    text: '',
  },
};

export default function Orchestration(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>(ORCHESTRATION_DATA);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0].id);
  const [selectedTask, setSelectedTask] = useState<{ stageIdx: number; taskIdx: number }>(tickets[0].workflow.selectedTask);

  // Filtered tickets
  const filteredTickets = tickets.filter(t => filter === 'all' ? true : t.status === filter);
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || tickets[0];
  const workflow = selectedTicket.workflow;

  // Like button handler
  const toggleLike = (id: string): void => {
    setTickets(ts => ts.map(t => t.id === id ? { ...t, liked: !t.liked } : t));
  };

  // Ticket select handler
  const handleTicketSelect = (id: string): void => {
    setSelectedTicketId(id);
    setSelectedTask(tickets.find(t => t.id === id)?.workflow.selectedTask || { stageIdx: 0, taskIdx: 0 });
  };

  // Task select handler
  const handleTaskSelect = (stageIdx: number, taskIdx: number): void => {
    setSelectedTask({ stageIdx, taskIdx });
  };

  // Get selected task details
  const stage = workflow.stages[selectedTask.stageIdx];
  const task = stage.tasks[selectedTask.taskIdx];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="flex flex-col md:flex-row mx-auto min-h-screen">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="p-4">
            <div className="mb-4">
              <div className="font-semibold text-xs text-gray-500 dark:text-gray-400 mb-2">FILTERS</div>
              <div className="flex gap-2">
                <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded text-xs font-semibold shadow ${filter === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>All</button>
                <button onClick={() => setFilter('open')} className={`px-3 py-1 rounded text-xs font-semibold shadow ${filter === 'open' ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Open</button>
                <button onClick={() => setFilter('closed')} className={`px-3 py-1 rounded text-xs font-semibold shadow ${filter === 'closed' ? 'bg-violet-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}>Closed</button>
              </div>
            </div>
            <div>
              <div className="font-semibold text-xs text-gray-500 dark:text-gray-400 mb-2">TICKETS</div>
              <div className="flex flex-col gap-1">
                {filteredTickets.map(ticket => (
                  <button
                    key={ticket.id}
                    onClick={() => handleTicketSelect(ticket.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between ${selectedTicketId === ticket.id ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 font-semibold shadow' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
                  >
                    <span>
                      {ticket.status === 'closed' && <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />}
                      {ticket.status === 'open' && <FontAwesomeIcon icon={faHourglassHalf} className="text-blue-500 mr-1" />}
                      {ticket.customer}
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-normal">Ticket #{ticket.id}</div>
                    </span>
                    <button
                      className="ml-2 text-lg focus:outline-none"
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleLike(ticket.id); }}
                      title={ticket.liked ? 'Unlike' : 'Like'}
                    >
                      <FontAwesomeIcon icon={ticket.liked ? faHeartSolid : faHeartRegular} className={ticket.liked ? 'text-red-500' : 'text-gray-400'} />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-50 dark:bg-gray-900">
          {/* Breadcrumbs */}
          <div className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            Tickets <span className="mx-1">›</span> Ticket #{selectedTicket.id}
          </div>
          {/* Title */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Order Processing</h2>
            <span className="text-xs text-gray-400 dark:text-gray-500">Ticket #{selectedTicket.id}</span>
          </div>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">{workflow.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-violet-500 h-2 rounded-full transition-all duration-500" style={{ width: `${workflow.progress}%` }} />
            </div>
          </div>
          {/* Workflow Execution */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Process Execution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workflow.stages.map((stage, stageIdx) => (
                <div
                  key={stage.name}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700`}
                >
                  <div className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
                    <FontAwesomeIcon icon={stage.icon} /> {stage.name}
                  </div>
                  {stage.tasks.map((t, taskIdx) => (
                    <div
                      key={t.name}
                      className={`flex items-center justify-between ${STATUS_MAP[t.status].bg} border ${STATUS_MAP[t.status].color ? `border-${STATUS_MAP[t.status].color}-200 dark:border-${STATUS_MAP[t.status].color}-700` : 'border-gray-200 dark:border-gray-700'} rounded-lg p-4 mb-2 cursor-pointer ${selectedTask.stageIdx === stageIdx && selectedTask.taskIdx === taskIdx ? 'ring-2 ring-violet-400 dark:ring-violet-600' : ''}`}
                      onClick={() => handleTaskSelect(stageIdx, taskIdx)}
                    >
                      <div>
                        <div className={`font-semibold ${STATUS_MAP[t.status].text}`}>{t.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.description}</div>
                      </div>
                      {t.status !== 'none' && (
                        <FontAwesomeIcon icon={STATUS_MAP[t.status].icon} className={`text-xl ${STATUS_MAP[t.status].text}`} />
                      )}
                    </div>
                  ))}
                  <div className={`text-xs font-semibold mt-1 ${STATUS_MAP[stage.tasks[0].status].text}`}>{STATUS_MAP[stage.tasks[0].status].label}</div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Task Details Panel */}
        <aside className="w-full md:w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-bold">Task Details</div>
            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">&times;</button>
          </div>
          <div className="mb-2">
            <div className="font-semibold text-base">{task.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Part of Ticket #{selectedTicket.id}: Order Processing</div>
          </div>
          <div className="mb-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500" />
              <span>Priority: <span className="font-semibold text-red-500">High</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faUser} className="text-gray-500 dark:text-gray-400" />
              <span>Assignee: <span className="font-semibold">Payment Bot</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faClock} className="text-gray-500 dark:text-gray-400" />
              <span>Status: <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded font-semibold text-xs ml-1">{STATUS_MAP[task.status].label || 'In Progress'}</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faHourglassHalf} className="text-gray-500 dark:text-gray-400" />
              <span>Duration: <span className="font-semibold">Approx. 5 mins</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faClock} className="text-gray-500 dark:text-gray-400" />
              <span>Start Time: <span className="font-semibold">2023-10-27 10:05 AM</span></span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faStop} className="text-gray-500 dark:text-gray-400" />
              <span>End Time: <span className="font-semibold">-</span></span>
            </div>
          </div>
          <div className="mb-4">
            <div className="font-semibold mb-1">Logs</div>
            <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs font-mono text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto">
              {workflow.logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
          <button className="w-full mt-auto px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow transition">View Full Ticket Details</button>
        </aside>
      </div>
    </div>
  );
} 
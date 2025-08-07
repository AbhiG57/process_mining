import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faHourglassHalf, faExclamationCircle, faBoxOpen, faTruck, faWarehouse, faClipboardList, faUser, faHistory, faTimesCircle, faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

interface Task {
  name: string;
  status: 'completed' | 'inprogress' | 'pending' | 'error' | 'none';
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

const TICKET_DATA: Ticket[] = [
  {
    id: '4321',
    customer: 'John Doe',
    status: 'open',
    liked: false,
    workflow: {
      orderNumber: '56789',
      eta: '2024-03-10',
      orderDate: '2024-03-05',
      progress: 80,
      stages: [
        {
          name: 'Order Placed',
          icon: faBoxOpen,
          color: 'blue',
          tasks: [
            { name: 'Confirm Payment', status: 'completed' },
            { name: 'Assign Warehouse', status: 'inprogress' },
          ],
        },
        {
          name: 'Packed',
          icon: faWarehouse,
          color: 'yellow',
          tasks: [
            { name: 'Generate Invoice', status: 'none' },
            { name: 'Pack Items', status: 'pending' },
            { name: 'Verify Stock', status: 'error' },
          ],
        },
        {
          name: 'Shipped',
          icon: faTruck,
          color: 'orange',
          tasks: [
            { name: 'Schedule Pickup', status: 'none' },
            { name: 'Update Tracking Info', status: 'none' },
          ],
        },
        {
          name: 'Out for Delivery',
          icon: faTruck,
          color: 'gray',
          tasks: [
            { name: 'Notify Customer', status: 'none' },
          ],
        },
      ],
      logs: [
        '[2024-03-05 10:05:12] Task initiated by system.',
        '[2024-03-05 10:05:30] Checking inventory levels...',
        '[2024-03-05 10:06:01] Awaiting warehouse capacity confirmation.',
      ],
      selectedTask: { stageIdx: 0, taskIdx: 1 },
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
          name: 'Order Placed',
          icon: faBoxOpen,
          color: 'blue',
          tasks: [
            { name: 'Confirm Payment', status: 'completed' },
            { name: 'Assign Warehouse', status: 'completed' },
          ],
        },
        {
          name: 'Packed',
          icon: faWarehouse,
          color: 'yellow',
          tasks: [
            { name: 'Generate Invoice', status: 'completed' },
            { name: 'Pack Items', status: 'completed' },
            { name: 'Verify Stock', status: 'completed' },
          ],
        },
        {
          name: 'Shipped',
          icon: faTruck,
          color: 'orange',
          tasks: [
            { name: 'Schedule Pickup', status: 'completed' },
            { name: 'Update Tracking Info', status: 'completed' },
          ],
        },
        {
          name: 'Out for Delivery',
          icon: faTruck,
          color: 'gray',
          tasks: [
            { name: 'Notify Customer', status: 'completed' },
          ],
        },
      ],
      logs: [
        '[2024-03-06 09:00:00] Order completed.',
      ],
      selectedTask: { stageIdx: 0, taskIdx: 0 },
    },
  },
  {
    id: '4323',
    customer: 'Acme Corp',
    status: 'open',
    liked: false,
    workflow: {
      orderNumber: '56801',
      eta: '2024-03-15',
      orderDate: '2024-03-07',
      progress: 40,
      stages: [
        {
          name: 'Order Placed',
          icon: faBoxOpen,
          color: 'blue',
          tasks: [
            { name: 'Confirm Payment', status: 'completed' },
            { name: 'Assign Warehouse', status: 'pending' },
          ],
        },
        {
          name: 'Packed',
          icon: faWarehouse,
          color: 'yellow',
          tasks: [
            { name: 'Generate Invoice', status: 'none' },
            { name: 'Pack Items', status: 'none' },
            { name: 'Verify Stock', status: 'none' },
          ],
        },
        {
          name: 'Shipped',
          icon: faTruck,
          color: 'orange',
          tasks: [
            { name: 'Schedule Pickup', status: 'none' },
            { name: 'Update Tracking Info', status: 'none' },
          ],
        },
        {
          name: 'Out for Delivery',
          icon: faTruck,
          color: 'gray',
          tasks: [
            { name: 'Notify Customer', status: 'none' },
          ],
        },
      ],
      logs: [
        '[2024-03-07 11:00:00] Task initiated by system.',
      ],
      selectedTask: { stageIdx: 0, taskIdx: 1 },
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

export default function TicketFlow(): JSX.Element {
  const [tickets, setTickets] = useState<Ticket[]>(TICKET_DATA);
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
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <FontAwesomeIcon icon={faClipboardList} className="text-violet-600 dark:text-violet-400" />
            Order Workflow: <span className="text-gray-700 dark:text-gray-200">#{workflow.orderNumber}</span>
          </h1>
          <div className="text-gray-500 dark:text-gray-400 text-sm">Track and manage order processing stages for {selectedTicket.customer}.</div>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
            <option>Order #{workflow.orderNumber} - {selectedTicket.customer} - ETA: {workflow.eta}</option>
          </select>
          <button className="ml-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition text-sm">Filter Orders</button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
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
        <main className="flex-1">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{workflow.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${workflow.progress}%` }} />
            </div>
          </div>
          {/* Stages */}
          <div className="flex flex-col md:flex-row gap-4 px-6 py-8 overflow-x-auto">
            {workflow.stages.map((stage, stageIdx) => (
              <div
                key={stage.name}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow border min-w-[260px] flex-1 p-4 ${stage.color === 'blue' ? 'border-blue-300 dark:border-blue-600 ring-2 ring-blue-200 dark:ring-blue-700' : 'border-gray-200 dark:border-gray-700'}`}
              >
                <div className={`flex items-center gap-2 mb-2 font-semibold ${stage.color === 'blue' ? 'text-blue-700 dark:text-blue-300' : stage.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-300' : stage.color === 'orange' ? 'text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-200'}`}>
                  <FontAwesomeIcon icon={stage.icon} /> {stage.name} <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{stage.tasks.length} Task{stage.tasks.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {stage.tasks.map((t, taskIdx) => (
                    <div
                      key={t.name}
                      className={`flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2 cursor-pointer ${selectedTask.stageIdx === stageIdx && selectedTask.taskIdx === taskIdx ? 'ring-2 ring-blue-400 dark:ring-blue-600' : ''}`}
                      onClick={() => handleTaskSelect(stageIdx, taskIdx)}
                    >
                      <span>{t.name}</span>
                      {t.status !== 'none' && (
                        <span className={`flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded ${STATUS_MAP[t.status].bg} ${STATUS_MAP[t.status].text}`}>
                          <FontAwesomeIcon icon={STATUS_MAP[t.status].icon} /> {STATUS_MAP[t.status].label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Task Details */}
          <div className="px-6 pb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 mt-6 flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="mb-2 text-lg font-semibold">Task Details: <span className="text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">{task.name}</span></div>
                <div className="mb-2 flex flex-wrap gap-8 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Order #</div>
                    <div className="font-semibold">#{workflow.orderNumber}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Customer</div>
                    <div className="font-semibold">{selectedTicket.customer}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Order Date</div>
                    <div className="font-semibold">{workflow.orderDate}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Estimated Delivery</div>
                    <div className="font-semibold">{workflow.eta}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">Task Status</div>
                    {task.status !== 'none' && (
                      <span className={`flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded ${STATUS_MAP[task.status].bg} ${STATUS_MAP[task.status].text}`}>
                        <FontAwesomeIcon icon={STATUS_MAP[task.status].icon} /> {STATUS_MAP[task.status].label}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-semibold mb-1">Task Logs:</div>
                  <div className="bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-xs font-mono text-gray-700 dark:text-gray-300 max-h-32 overflow-y-auto">
                    {workflow.logs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Actions */}
              <div className="flex flex-col gap-3 min-w-[220px]">
                <button className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition flex items-center gap-2 justify-center">
                  <FontAwesomeIcon icon={faUser} /> Reassign Task
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold shadow transition flex items-center gap-2 justify-center">
                  <FontAwesomeIcon icon={faHistory} /> View History
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition flex items-center gap-2 justify-center">
                  <FontAwesomeIcon icon={faTimesCircle} /> Mark as Error
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition flex items-center gap-2 justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} /> Complete Task
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "./Modal";
import {
  faUser,
  faSearch,
  faClipboardList,
  faCartPlus,
  faShoppingCart,
  faMapMarkerAlt,
  faTruck,
  faCreditCard,
  faEdit,
  faTrash,
  faArrowUp,
  faArrowDown,
  faPlus,
  faMinus,
  faCodeMerge,
  faArrowsSplitUpAndLeft
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface Task {
  task_number: number;
  task_name: string;
  task_description: string;
  steps: string[];
}

interface ProcessData {
  process_title: string;
  video_analysis_summary: string;
  tasks: Task[];
}

interface EditTaskModalProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Task) => void;
  onDelete: (taskNumber: number) => void;
  onReorder: (taskNumber: number, direction: 'up' | 'down') => void;
  onMerge: (taskNumber: number, targetTaskNumber: number) => void;
  onSplit: (taskNumber: number, splitStep: number) => void;
  tasks: Task[];
}

const taskIconMap: Record<number, any> = {
  1: faUser,
  2: faSearch,
  3: faClipboardList,
  4: faCartPlus,
  5: faShoppingCart,
  6: faMapMarkerAlt,
  7: faTruck,
  8: faCreditCard
};

const processData: ProcessData = {
  process_title: "Shopping on Amazon",
  video_analysis_summary:
    "This video tutorial demonstrates how to shop on Amazon, covering login, search, selection, and checkout processes.",
  tasks: [
    {
      task_number: 1,
      task_name: "Account Login/Creation",
      task_description:
        "The user either logs into their existing Amazon account or creates a new one.",
      steps: [
        "Step 1.1: Navigate to the Amazon homepage.",
        "Step 1.2: Click on the 'Sign In' button.",
        "Step 1.3: If an existing user, enter the registered email or mobile number and password.",
        "Step 1.4: Click on 'Login'.",
        "Step 1.5: If a new user, click on 'I am a new customer'.",
        "Step 1.6: Fill out the registration form with name, email, and password.",
        "Step 1.7: Click on 'Create your Amazon account'."
      ]
    },
    {
      task_number: 2,
      task_name: "Product Search",
      task_description:
        "The user searches for the desired product either by browsing or typing in the search bar.",
      steps: [
        "Step 2.1: To search by category, click the 'Shop by Category' dropdown menu.",
        "Step 2.2: Select the relevant product category (e.g., 'Mobiles & Tablets'), then browse.",
        "Step 2.3: Alternatively, use the search bar by typing the product name or category.",
        "Step 2.4: Click the search icon."
      ]
    },
    {
      task_number: 3,
      task_name: "Product Selection and Review",
      task_description:
        "The user selects a product from the search results and reviews its details.",
      steps: [
        "Step 3.1: From the search results, browse the available products.",
        "Step 3.2: Check product ratings and customer reviews.",
        "Step 3.3: Click on the desired product to view its individual page.",
        "Step 3.4: Review the product images, details, specifications, and customer reviews."
      ]
    },
    {
      task_number: 4,
      task_name: "Adding to Cart/Buy Now",
      task_description:
        "The user adds the product to the cart for later purchase or proceeds directly to buy.",
      steps: [
        "Step 4.1: To buy immediately, click the 'Buy Now' button.",
        "Step 4.2: To add to cart for later purchase, click the 'Add to Cart' button."
      ]
    },
    {
      task_number: 5,
      task_name: "Cart Review (If Added to Cart)",
      task_description:
        "If items are added to the cart, the user reviews the items before checkout.",
      steps: [
        "Step 5.1: Click on the cart icon at the top right of the screen.",
        "Step 5.2: Review the items in the cart.",
        "Step 5.3: Adjust the quantity of each item, if desired.",
        "Step 5.4: Remove items if needed.",
        "Step 5.5: Click on 'Proceed to checkout'."
      ]
    },
    {
      task_number: 6,
      task_name: "Delivery Information",
      task_description: "The user provides the delivery address.",
      steps: [
        "Step 6.1: Select a previously saved delivery address.",
        "Step 6.2: Alternatively, add a new delivery address by filling out the address form.",
        "Step 6.3: Click 'Deliver to this address'."
      ]
    },
    {
      task_number: 7,
      task_name: "Delivery Options and Payment Method",
      task_description:
        "The user selects their delivery speed and payment method.",
      steps: [
        "Step 7.1: Confirm delivery address and choose a delivery speed and click on 'Continue'.",
        "Step 7.2: Select a payment method: credit card, debit card, or net banking.",
        "Step 7.3: For net banking, select the bank.",
        "Step 7.4: Click 'Continue'."
      ]
    },
    {
      task_number: 8,
      task_name: "Order Review and Payment Confirmation",
      task_description:
        "The user reviews the order and confirms payment through their selected method.",
      steps: [
        "Step 8.1: Review the order details and delivery address.",
        "Step 8.2: Enter any gift cards or promotional codes, if applicable.",
        "Step 8.3: Click 'Place your order and pay'.",
        "Step 8.4: Complete the payment process through the selected payment gateway (e.g. net banking, card).",
        "Step 8.5: After successful payment, a confirmation message is displayed ('Thank you for your order')."
      ]
    }
  ]
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #35373B',
  fontSize: 14
};

function EditTaskModal({ open, onClose, task, onSave, onDelete, onReorder, onMerge, onSplit, tasks }: EditTaskModalProps): JSX.Element | null {
  if (!open || !task) return null;

  const [editedTask, setEditedTask] = useState<Task>(task);
  const [editMode, setEditMode] = useState<'basic' | 'steps' | 'reorder' | 'merge' | 'split'>('basic');
  const [mergeTargetTask, setMergeTargetTask] = useState<string>('');
  const [splitStepNumber, setSplitStepNumber] = useState<number>(1);

  const handleSave = (): void => {
    onSave(editedTask);
    onClose();
  };

  const renderEditOptions = (): JSX.Element => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <button 
          onClick={() => setEditMode('basic')} 
          style={{...buttonStyle}}
          className={ editMode === 'basic' ? 'bg-teal-400' : 'bg-gray-200 dark:bg-gray-900' }
        >
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
          Edit Task Details
        </button>
        <button 
          onClick={() => setEditMode('steps')} 
          style={{...buttonStyle}}
          className={ editMode === 'steps' ? 'bg-teal-400' : 'bg-gray-200 dark:bg-gray-900' }
        >
          <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }} />
          Edit Steps
        </button>
        <button 
          onClick={() => setEditMode('reorder')} 
          style={{...buttonStyle}}
          className={ editMode === 'reorder' ? 'bg-teal-400' : 'bg-gray-200 dark:bg-gray-900' }
        >
          <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: '8px' }} />
          Reorder Tasks
        </button>
        <button 
          onClick={() => setEditMode('merge')} 
          style={{...buttonStyle}}
          className={ editMode === 'merge' ? 'bg-teal-400' : 'bg-gray-200 dark:bg-gray-900' }
        >
          <FontAwesomeIcon icon={faCodeMerge} style={{ marginRight: '8px' }} />
          Merge with Another Task
        </button>
        <button 
          onClick={() => setEditMode('split')} 
          style={{...buttonStyle}}
          className={ editMode === 'split' ? 'bg-teal-400' : 'bg-gray-200 dark:bg-gray-900' }
        >
          <FontAwesomeIcon icon={faArrowsSplitUpAndLeft} style={{ marginRight: '8px' }} />
          Split Task
        </button>
        <button 
          onClick={() => onDelete(task.task_number)} 
          style={{...buttonStyle, background: '#FF4D4D'}}
        >
          <FontAwesomeIcon icon={faTrash} style={{ marginRight: '8px' }} />
          Delete Task
        </button>
      </div>
    );
  };

  const renderBasicEdit = (): JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Task Name</label>
        <input
          type="text"
          className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
          value={editedTask.task_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditedTask({...editedTask, task_name: e.target.value})}
          style={inputStyle}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Task Description</label>
        <textarea
          value={editedTask.task_description}
          className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditedTask({...editedTask, task_description: e.target.value})}
          style={{...inputStyle, minHeight: '100px'}}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Task Icon</label>
        <select
          value={editedTask.task_number}
          className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditedTask({...editedTask, task_number: parseInt(e.target.value)})}
          style={inputStyle}
        >
          {Object.entries(taskIconMap).map(([num, icon]) => (
            <option key={num} value={num}>
              Task {num} ({icon.iconName})
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStepsEdit = (): JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {editedTask.steps.map((step, index) => (
        <div key={index} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={step}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newSteps = [...editedTask.steps];
              newSteps[index] = e.target.value;
              setEditedTask({...editedTask, steps: newSteps});
            }}
            style={inputStyle}
            className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={() => {
              const newSteps = editedTask.steps.filter((_, i) => i !== index);
              setEditedTask({...editedTask, steps: newSteps});
            }}
            style={{...buttonStyle, padding: '8px'}}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}
      <button
        onClick={() => setEditedTask({
          ...editedTask,
          steps: [...editedTask.steps, `Step ${editedTask.steps.length + 1}: `]
        })}
        style={buttonStyle}
      >
        Add Step
      </button>
    </div>
  );

  const renderMergeOptions = (): JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ marginBottom: '8px' }}>
        Select a task to merge with the current task. The steps from both tasks will be combined.
      </div>
      <select 
        value={mergeTargetTask} 
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMergeTargetTask(e.target.value)}
        style={inputStyle}
        className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select task to merge with...</option>
        {tasks
          .filter(t => t.task_number !== task.task_number)
          .map(t => (
            <option key={t.task_number} value={t.task_number}>
              {t.task_name}
            </option>
          ))}
      </select>
      <button 
        onClick={() => {
          if (mergeTargetTask) {
            onMerge(task.task_number, parseInt(mergeTargetTask));
          }
        }} 
        style={{...buttonStyle, opacity: mergeTargetTask ? 1 : 0.5}}
        className="dark:bg-gray-800 bg-gray-300"
        disabled={!mergeTargetTask}
      >
        Merge Tasks
      </button>
    </div>
  );

  const renderSplitOptions = (): JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{  marginBottom: '8px' }}>
        Choose the step number where you want to split this task. The task will be divided into two separate tasks.
      </div>
      <input
        type="number"
        min="1"
        max={editedTask.steps.length}
        value={splitStepNumber}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSplitStepNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), editedTask.steps.length))}
        style={inputStyle}
        className="bg-gray-200 text-black dark:bg-gray-800 dark:text-white"
      />
      <div style={{  fontSize: '14px' }}>
        Current task will be split into:
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Task 1: Steps 1 to {splitStepNumber}</li>
          <li>Task 2: Steps {splitStepNumber + 1} to {editedTask.steps.length}</li>
        </ul>
      </div>
      <button 
        onClick={() => onSplit(task.task_number, splitStepNumber)} 
        style={buttonStyle}
        className="dark:bg-gray-800 bg-gray-300"
      >
        Split Task
      </button>
    </div>
  );

  return (
    <div style={{
      position: "fixed",
      top: 64,
      right: 0,
      width: 540,
      maxHeight: 'calc(100vh - 64px)',
      height: 'calc(100vh - 64px)',
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      zIndex: 1000
    }}>
      <div className="bg-gray-100 text-black dark:bg-gray-800 dark:text-white" style={{borderRadius: 12, padding: 32, minWidth: 500, maxWidth: 600, height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)', overflow: 'auto', marginRight: 0 }}>
        <h2 style={{ marginBottom: 16 }}>Edit Task: {task.task_name}</h2>
        
        {renderEditOptions()}
        
        <div style={{  
          borderRadius: 8, 
          padding: 20, 
          marginTop: 20 
        }} className="bg-gray-200 text-black dark:bg-gray-900 dark:text-white">
          {editMode === 'basic' && renderBasicEdit()}
          {editMode === 'steps' && renderStepsEdit()}
          {editMode === 'reorder' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => onReorder(task.task_number, 'up')} style={buttonStyle} className="dark:bg-gray-800 bg-gray-300">
                <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: '8px' }} /> Move Up
              </button>
              <button onClick={() => onReorder(task.task_number, 'down')} style={buttonStyle} className="dark:bg-gray-800 bg-gray-300">
                <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: '8px' }} /> Move Down
              </button>
            </div>
          )}
          {editMode === 'merge' && renderMergeOptions()}
          {editMode === 'split' && renderSplitOptions()}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{...buttonStyle}} className="dark:bg-gray-900 bg-gray-300">Cancel</button>
          {editMode === 'basic' && (
            <button onClick={handleSave} style={{...buttonStyle, background: '#3ED2B0'}} className="">Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProcessTaskSteps(): JSX.Element {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalSteps, setModalSteps] = useState<string[]>([]);
  const [modalTaskName, setModalTaskName] = useState<string>("");
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(processData.tasks);
  const navigate = useNavigate();
  const [reorderedTask, setReorderedTask] = useState<number | null>(null);
  const [showReorderMsg, setShowReorderMsg] = useState<boolean>(false);
  const reorderTimeout = useRef<NodeJS.Timeout | null>(null);

  const openModal = (steps: string[], name: string): void => {
    setModalSteps(steps);
    setModalTaskName(name);
    setModalOpen(true);
  };

  const handleEditTask = (task: Task): void => {
    setEditingTask(task);
    setEditModalOpen(true);
  };

  const handleSaveTask = (updatedTask: Task): void => {
    setTasks(tasks.map(task => 
      task.task_number === updatedTask.task_number ? updatedTask : task
    ));
  };

  const handleDeleteTask = (taskNumber: number): void => {
    setTasks(tasks.filter(task => task.task_number !== taskNumber));
    setEditModalOpen(false);
  };

  const handleReorderTask = (taskNumber: number, direction: 'up' | 'down'): void => {
    const currentIndex = tasks.findIndex(task => task.task_number === taskNumber);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === tasks.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newTasks = [...tasks];
    [newTasks[currentIndex], newTasks[newIndex]] = [newTasks[newIndex], newTasks[currentIndex]];
    setTasks(newTasks);
    setReorderedTask(newTasks[newIndex].task_number);
    setShowReorderMsg(true);
    if (reorderTimeout.current) clearTimeout(reorderTimeout.current);
    reorderTimeout.current = setTimeout(() => {
      setReorderedTask(null);
      setShowReorderMsg(false);
    }, 2000);
  };

  const handleMergeTasks = (taskNumber: number, targetTaskNumber: number): void => {
    const sourceTask = tasks.find(t => t.task_number === taskNumber);
    const targetTask = tasks.find(t => t.task_number === targetTaskNumber);
    
    if (sourceTask && targetTask) {
      const mergedTask: Task = {
        ...targetTask,
        task_name: `${targetTask.task_name} + ${sourceTask.task_name}`,
        steps: [...targetTask.steps, ...sourceTask.steps]
      };
      
      setTasks(tasks.filter(t => t.task_number !== taskNumber)
        .map(t => t.task_number === targetTaskNumber ? mergedTask : t));
    }
    setEditModalOpen(false);
  };

  const handleSplitTask = (taskNumber: number, splitStep: number): void => {
    const taskToSplit = tasks.find(t => t.task_number === taskNumber);
    if (taskToSplit && splitStep < taskToSplit.steps.length) {
      const firstPart: Task = {
        ...taskToSplit,
        task_name: `${taskToSplit.task_name} (Part 1)`,
        steps: taskToSplit.steps.slice(0, splitStep)
      };
      
      const secondPart: Task = {
        ...taskToSplit,
        task_number: Math.max(...tasks.map(t => t.task_number)) + 1,
        task_name: `${taskToSplit.task_name} (Part 2)`,
        steps: taskToSplit.steps.slice(splitStep)
      };
      
      setTasks(tasks.filter(t => t.task_number !== taskNumber)
        .concat([firstPart, secondPart]));
    }
    setEditModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white px-8 py-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">
          {processData.process_title}
          <span className="bg-yellow-600 text-yellow-100 text-sm font-semibold rounded-md px-3 py-1 ml-4 align-middle">
            IN REVIEW
          </span>
        </h1>
        <div className="text-gray-500 dark:text-gray-300 text-base mb-8">
          {processData.video_analysis_summary}
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Process Tasks</h2>
        
        {showReorderMsg && (
          <div className="bg-gray-100 dark:bg-gray-800 text-green-500 border border-green-500 rounded-lg p-4 mb-4 font-semibold flex items-center justify-center gap-2 shadow-md">
            ✔️ Task moved! Highlighted below.
          </div>
        )}
        
        <div className="border-l-2 border-gray-200 dark:border-gray-700 ml-4 pl-6">
          {tasks.map((task, idx) => (
            <div
              key={task.task_number}
              className={`flex items-start mb-8 relative transition-all duration-300 ${
                reorderedTask === task.task_number
                  ? 'bg-gray-100 dark:bg-gray-800 text-green-500 rounded-xl shadow-lg animate-slideIn'
                  : ''
              }`}
            >
              <div className="absolute -left-10 top-0 text-2xl text-gray-400">
                <FontAwesomeIcon icon={taskIconMap[task.task_number]} />
              </div>
              
              <div className="flex-1">
                <div className="font-bold text-lg mb-1">{task.task_name}</div>
                <div className="text-gray-500 dark:text-gray-300 text-sm mb-2">
                  {task.task_description}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => openModal(task.steps, task.task_name)}
                    className="text-green-500 hover:text-green-600 font-semibold text-sm flex items-center gap-1.5"
                  >
                    <FontAwesomeIcon icon={faClipboardList} />
                    VIEW STEPS
                  </button>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-gray-400 hover:text-white font-semibold text-sm flex items-center gap-1.5"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                    EDIT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-4 mt-10">
          <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-8 py-3 font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Regenerate
          </button>
          <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl px-8 py-3 font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Edit Tasks
          </button>
          <button
            onClick={() => navigate('/workflowbuilder')}
            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-8 py-3 font-semibold text-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Approve
          </button>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} steps={modalSteps} taskName={modalTaskName} />
      <EditTaskModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        onReorder={handleReorderTask}
        onMerge={handleMergeTasks}
        onSplit={handleSplitTask}
        tasks={tasks}
      />

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateY(20px); opacity: 0.5; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
} 
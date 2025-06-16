import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
const taskIconMap = {
  1: faUser,
  2: faSearch,
  3: faClipboardList,
  4: faCartPlus,
  5: faShoppingCart,
  6: faMapMarkerAlt,
  7: faTruck,
  8: faCreditCard
};

const processData = {
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

function Modal({ open, onClose, steps, taskName }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{ background: "#23262F", color: "#fff", borderRadius: 12, padding: 32, minWidth: 350, maxWidth: 500 }}>
        <h2 style={{ marginBottom: 16 }}>{taskName} - Steps</h2>
        <ol style={{ marginBottom: 24 }}>
          {steps.map((step, idx) => (
            <li key={idx} style={{ marginBottom: 8 }}>{step}</li>
          ))}
        </ol>
        <button onClick={onClose} style={{ background: "#E6E8EB", color: "#181A20", border: "none", borderRadius: 8, padding: "8px 24px", fontWeight: 600, fontSize: 16, cursor: "pointer" }}>Close</button>
      </div>
    </div>
  );
}

function EditTaskModal({ open, onClose, task, onSave, onDelete, onReorder, onMerge, onSplit, tasks }) {
  if (!open) return null;

  const [editedTask, setEditedTask] = useState(task);
  const [editMode, setEditMode] = useState('basic'); // 'basic', 'steps', 'reorder', 'merge', 'split'
  const [mergeTargetTask, setMergeTargetTask] = useState('');
  const [splitStepNumber, setSplitStepNumber] = useState(1);

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  const renderEditOptions = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <button 
          onClick={() => setEditMode('basic')} 
          style={{...buttonStyle, background: editMode === 'basic' ? '#3ED2B0' : '#E6E8EB'}}
        >
          <FontAwesomeIcon icon={faEdit} style={{ marginRight: '8px' }} />
          Edit Task Details
        </button>
        <button 
          onClick={() => setEditMode('steps')} 
          style={{...buttonStyle, background: editMode === 'steps' ? '#3ED2B0' : '#E6E8EB'}}
        >
          <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }} />
          Edit Steps
        </button>
        <button 
          onClick={() => setEditMode('reorder')} 
          style={{...buttonStyle, background: editMode === 'reorder' ? '#3ED2B0' : '#E6E8EB'}}
        >
          <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: '8px' }} />
          Reorder Tasks
        </button>
        <button 
          onClick={() => setEditMode('merge')} 
          style={{...buttonStyle, background: editMode === 'merge' ? '#3ED2B0' : '#E6E8EB'}}
        >
          <FontAwesomeIcon icon={faCodeMerge} style={{ marginRight: '8px' }} />
          Merge with Another Task
        </button>
        <button 
          onClick={() => setEditMode('split')} 
          style={{...buttonStyle, background: editMode === 'split' ? '#3ED2B0' : '#E6E8EB'}}
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

  const renderBasicEdit = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Task Name</label>
        <input
          type="text"
          value={editedTask.task_name}
          onChange={(e) => setEditedTask({...editedTask, task_name: e.target.value})}
          style={inputStyle}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Task Description</label>
        <textarea
          value={editedTask.task_description}
          onChange={(e) => setEditedTask({...editedTask, task_description: e.target.value})}
          style={{...inputStyle, minHeight: '100px'}}
        />
      </div>
      <div>
        <label style={{ display: 'block', marginBottom: '4px' }}>Task Icon</label>
        <select
          value={editedTask.task_number}
          onChange={(e) => setEditedTask({...editedTask, task_number: parseInt(e.target.value)})}
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

  const renderStepsEdit = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {editedTask.steps.map((step, index) => (
        <div key={index} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={step}
            onChange={(e) => {
              const newSteps = [...editedTask.steps];
              newSteps[index] = e.target.value;
              setEditedTask({...editedTask, steps: newSteps});
            }}
            style={inputStyle}
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

  const renderMergeOptions = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ color: '#B0B3B8', marginBottom: '8px' }}>
        Select a task to merge with the current task. The steps from both tasks will be combined.
      </div>
      <select 
        value={mergeTargetTask} 
        onChange={(e) => setMergeTargetTask(e.target.value)}
        style={inputStyle}
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
        disabled={!mergeTargetTask}
      >
        Merge Tasks
      </button>
    </div>
  );

  const renderSplitOptions = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ color: '#B0B3B8', marginBottom: '8px' }}>
        Choose the step number where you want to split this task. The task will be divided into two separate tasks.
      </div>
      <input
        type="number"
        min="1"
        max={editedTask.steps.length}
        value={splitStepNumber}
        onChange={(e) => setSplitStepNumber(Math.min(Math.max(1, parseInt(e.target.value) || 1), editedTask.steps.length))}
        style={inputStyle}
      />
      <div style={{ color: '#B0B3B8', fontSize: '14px' }}>
        Current task will be split into:
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Task 1: Steps 1 to {splitStepNumber}</li>
          <li>Task 2: Steps {splitStepNumber + 1} to {editedTask.steps.length}</li>
        </ul>
      </div>
      <button 
        onClick={() => onSplit(task.task_number, splitStepNumber)} 
        style={buttonStyle}
      >
        Split Task
      </button>
    </div>
  );

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{ background: "#23262F", color: "#fff", borderRadius: 12, padding: 32, minWidth: 500, maxWidth: 600 }}>
        <h2 style={{ marginBottom: 16 }}>Edit Task: {task.task_name}</h2>
        
        {renderEditOptions()}
        
        <div style={{ 
          background: '#181A20', 
          borderRadius: 8, 
          padding: 20, 
          marginTop: 20 
        }}>
          {editMode === 'basic' && renderBasicEdit()}
          {editMode === 'steps' && renderStepsEdit()}
          {editMode === 'reorder' && (
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => onReorder(task.task_number, 'up')} style={buttonStyle}>
                <FontAwesomeIcon icon={faArrowUp} style={{ marginRight: '8px' }} /> Move Up
              </button>
              <button onClick={() => onReorder(task.task_number, 'down')} style={buttonStyle}>
                <FontAwesomeIcon icon={faArrowDown} style={{ marginRight: '8px' }} /> Move Down
              </button>
            </div>
          )}
          {editMode === 'merge' && renderMergeOptions()}
          {editMode === 'split' && renderSplitOptions()}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{...buttonStyle, background: '#23262F'}}>Cancel</button>
          {editMode === 'basic' && (
            <button onClick={handleSave} style={{...buttonStyle, background: '#3ED2B0'}}>Save Changes</button>
          )}
        </div>
      </div>
    </div>
  );
}

const buttonStyle = {
  background: '#E6E8EB',
  color: '#181A20',
  border: 'none',
  borderRadius: 8,
  padding: '8px 16px',
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #35373B',
  background: '#23262F',
  color: '#fff',
  fontSize: 14
};

export default function ProcessTaskSteps() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSteps, setModalSteps] = useState([]);
  const [modalTaskName, setModalTaskName] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState(processData.tasks);
  const navigate = useNavigate();
  const openModal = (steps, name) => {
    setModalSteps(steps);
    setModalTaskName(name);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setEditModalOpen(true);
  };

  const handleSaveTask = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.task_number === updatedTask.task_number ? updatedTask : task
    ));
  };

  const handleDeleteTask = (taskNumber) => {
    setTasks(tasks.filter(task => task.task_number !== taskNumber));
    setEditModalOpen(false);
  };

  const handleReorderTask = (taskNumber, direction) => {
    const currentIndex = tasks.findIndex(task => task.task_number === taskNumber);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === tasks.length - 1)
    ) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newTasks = [...tasks];
    [newTasks[currentIndex], newTasks[newIndex]] = [newTasks[newIndex], newTasks[currentIndex]];
    setTasks(newTasks);
  };

  const handleMergeTasks = (taskNumber, targetTaskNumber) => {
    const sourceTask = tasks.find(t => t.task_number === taskNumber);
    const targetTask = tasks.find(t => t.task_number === targetTaskNumber);
    
    if (sourceTask && targetTask) {
      const mergedTask = {
        ...targetTask,
        task_name: `${targetTask.task_name} + ${sourceTask.task_name}`,
        steps: [...targetTask.steps, ...sourceTask.steps]
      };
      
      setTasks(tasks.filter(t => t.task_number !== taskNumber)
        .map(t => t.task_number === targetTaskNumber ? mergedTask : t));
    }
    setEditModalOpen(false);
  };

  const handleSplitTask = (taskNumber, splitStep) => {
    const taskToSplit = tasks.find(t => t.task_number === taskNumber);
    if (taskToSplit && splitStep < taskToSplit.steps.length) {
      const firstPart = {
        ...taskToSplit,
        task_name: `${taskToSplit.task_name} (Part 1)`,
        steps: taskToSplit.steps.slice(0, splitStep)
      };
      
      const secondPart = {
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
    <div style={{ background: "#181A20", color: "#fff", minHeight: "100vh", fontFamily: "Inter, sans-serif", padding: 40 }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>{processData.process_title}
          <span style={{ background: "#3A2F18", color: "#F6C768", fontSize: 16, fontWeight: 600, borderRadius: 8, padding: "4px 12px", marginLeft: 16, verticalAlign: "middle" }}>IN REVIEW</span>
        </h1>
        <div style={{ color: "#B0B3B8", fontSize: 16, marginBottom: 32 }}>{processData.video_analysis_summary}</div>
        <h2 style={{ fontSize: 24, fontWeight: 600, margin: "32px 0 16px" }}>Process Tasks</h2>
        <div style={{ borderLeft: "2px solid #35373B", marginLeft: 16, paddingLeft: 25 }}>
          {tasks.map((task, idx) => (
            <div key={task.task_number} style={{ display: "flex", alignItems: "flex-start", marginBottom: 36, position: "relative" }}>
              <div style={{ position: "absolute", left: -38, top: 0, fontSize: 28, color: "#B0B3B8" }}>
                <FontAwesomeIcon icon={taskIconMap[task.task_number]} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2 }}>{task.task_name}</div>
                <div style={{ color: "#B0B3B8", fontSize: 15, marginBottom: 2 }}>{task.task_description}</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => openModal(task.steps, task.task_name)} style={{ background: "none", color: "#3ED2B0", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <FontAwesomeIcon icon={faClipboardList} style={{ color: "#3ED2B0" }} /> VIEW STEPS
                  </button>
                  <button onClick={() => handleEditTask(task)} style={{ background: "none", color: "#E6E8EB", border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                    <FontAwesomeIcon icon={faEdit} style={{ color: "#E6E8EB" }} /> EDIT
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right", marginTop: 40, display: "flex", gap: 16, justifyContent: "flex-end" }}>
          <button style={{ background: "#23262F", color: "#fff", border: "none", borderRadius: 16, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Regenerate</button>
          <button style={{ background: "#23262F", color: "#fff", border: "none", borderRadius: 16, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Edit Tasks</button>
          <button onClick={() => navigate(`/`)} style={{ background: "#E6E8EB", color: "#181A20", border: "none", borderRadius: 16, padding: "12px 32px", fontWeight: 600, fontSize: 18, cursor: "pointer" }}>Approve</button>
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
    </div>
  );
} 
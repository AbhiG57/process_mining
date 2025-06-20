import React, { useCallback, useRef, useState, useEffect } from 'react';
import { ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StageNode from './nodes/StageNode';
import TaskCardNode from './nodes/TaskCardNode';
import IfElseNode from './nodes/IfElseNode';
import ErrorHandlerNode from './nodes/ErrorHandlerNode';
import Sidebar from './Sidebar';
import AnimatedDottedEdge from './AnimatedDottedEdge';

// Utility functions for localStorage persistence
const STORAGE_KEY = 'workflow-builder-state';

const saveToLocalStorage = (nodes, edges) => {
  try {
    const state = {
      nodes: nodes.map(node => ({
        ...node,
        // Ensure we only save necessary data
        data: {
          label: node.data.label,
          department: node.data.department,
          onDelete: undefined, // Don't save function references
        },
      })),
      edges,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const loadFromLocalStorage = () => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { nodes, edges } = JSON.parse(savedState);
      return { nodes, edges };
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};

const nodeTypes = {
  stage: StageNode,
  taskCard: TaskCardNode,
  ifElse: IfElseNode,
  errorHandler: ErrorHandlerNode,
};

const edgeTypes = {
  'animated-dotted': AnimatedDottedEdge,
};

const initialSidebarTasks = [
  { id: '1', label: 'Product Selection and Review', department: 'Search results and reviews its.' },
  { id: '2', label: 'Adding to Cart/Buy Now', department: 'Product to the cart' },
  { id: '3', label: 'Payment', department: 'Payment' },
  { id: '4', label: 'Order Confirmation', department: 'Order Confirmation' },
  { id: '5', label: 'Order Tracking', department: 'Order Tracking' },
  { id: '6', label: 'Order Cancellation', department: 'Order Cancellation' },
  { id: '7', label: 'Order Returns', department: 'Order Returns' }
];

const initialNodesBase = [
  {
    id: 'stage-1',
    type: 'stage',
    position: { x: 100, y: 100 },
    data: { label: 'Customer Onboarding' },
    style: { width: 250, height: 140 },
  },
  {
    id: '8',
    type: 'taskCard',
    position: { x: 120, y: 160 },
    data: { label: 'Account Login / Creation', department: 'Customer Account Creation' },
    parentNode: 'stage-1',
    extent: 'parent',
    draggable: true,
  },
  {
    id: 'ifelse-1',
    type: 'ifElse',
    position: { x: 400, y: 140 },
    data: { label: 'Loged In ?' },
  },
  {
    id: 'stage-2',
    type: 'stage',
    position: { x: 600, y: 100 },
    data: { label: 'Explore Products' },
    style: { width: 220, height: 140 },
  },
  {
    id: '9',
    type: 'taskCard',
    position: { x: 620, y: 160 },
    data: { label: 'Product Search', department: 'Browse Desired Products.' },
    parentNode: 'stage-2',
    extent: 'parent',
    draggable: true,
  },
  {
    id: 'error-1',
    type: 'errorHandler',
    position: { x: 350, y: 350 },
    data: { label: 'Account Login failed', description: 'Please Contact Customer Support' },
  },
];

const initialEdgesBase = [
  { id: 'e1-2', source: 'stage-1', target: 'ifelse-1', animated: false },
  { id: 'e2-3', source: 'ifelse-1', target: 'stage-2', animated: false },
  { id: 'e3-4', source: 'ifelse-1', target: 'error-1', animated: false, style: { stroke: '#f87171' } },
];

function isInsideStage(stageNode, position) {
  // Check if a point is inside the bounding box of a stage node
  const { x, y } = stageNode.position;
  const width = stageNode.style?.width || 220;
  const height = stageNode.style?.height || 140;
  return (
    position.x > x &&
    position.x < x + width &&
    position.y > y &&
    position.y < y + height
  );
}

// Add a simple modal for label editing
function LabelEditModal({ open, label, onSave, onClose, placeholder }) {
  const [value, setValue] = useState(label || '');
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg min-w-[320px]">
        <div className="mb-3 text-gray-900 dark:text-gray-100 font-semibold">{placeholder}</div>
        <input
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 mb-4"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => onSave(value)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowBuilder() {
  // Load initial state from localStorage or use defaults
  const savedState = loadFromLocalStorage();
  const initialNodes = savedState?.nodes || initialNodesBase;
  const initialEdges = savedState?.edges || initialEdgesBase;
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const onInit = (instance) => {
    console.log('React Flow Ready:', instance);
    setReactFlowInstance(instance);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarTasks, setSidebarTasks] = useState(() => {
    // Filter out tasks that are already on the canvas
    const taskNodes = initialNodes.filter(node => node.type === 'taskCard');
    return initialSidebarTasks.filter(task => 
      !taskNodes.some(node => node.data.label === task.label)
    );
  });
  const reactFlowWrapper = useRef(null);
  const stageIdRef = useRef(3);
  const taskIdRef = useRef(3);
  const [labelEdit, setLabelEdit] = useState({ open: false, nodeId: null, type: '', placeholder: '', label: '' });
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [showEdgeDeleteHelp, setShowEdgeDeleteHelp] = useState(false);

  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    saveToLocalStorage(nodes, edges);
  }, [nodes, edges]);

  // Enhanced node change handler
  const handleNodesChange = useCallback((changes) => {
    onNodesChange(changes);
  }, [onNodesChange]);

  // Enhanced edge change handler
  const handleEdgesChange = useCallback((changes) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  // Enhanced node drag stop handler
  const handleNodeDragStop = useCallback((event, node) => {
    if (node.type !== 'taskCard') return;
    
    // Find if dropped inside a stage
    const stage = nodes.find(
      (n) => n.type === 'stage' && isInsideStage(n, node.position)
    );
    
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === node.id) {
          if (stage) {
            return {
              ...n,
              parentNode: stage.id,
              extent: 'parent',
              draggable: true,
            };
          } else {
            // Remove parent if not inside any stage
            const { parentNode, extent, ...rest } = n;
            return {
              ...rest,
              position: node.position,
              draggable: true,
            };
          }
        }
        return n;
      })
    );
  }, [nodes, setNodes]);

  // Enhanced connect handler
  const onConnect = useCallback(
    (params) => {
      setEdges((eds) => addEdge({ ...params, animated: false }, eds));
    },
    [setEdges]
  );

  // Add new Stage node
  const handleAddStage = () => {
    const newId = `stage-${stageIdRef.current++}`;
    setNodes((nds) => nds.concat({
      id: newId,
      type: 'stage',
      position: { x: 200, y: 200 },
      data: { label: `New Stage` },
      style: { width: 220, height: 140 },
    }));
    setTimeout(() => setLabelEdit({ open: true, nodeId: newId, type: 'stage', placeholder: 'Rename this Stage', label: '' }), 0);
  };

  // Delete Stage and its children
  const handleDeleteStage = (stageId) => {
    setNodes((nds) => nds.filter(n => n.id !== stageId && n.parentNode !== stageId));
    setEdges((eds) => eds.filter(e => e.source !== stageId && e.target !== stageId));
  };

  // Delete TaskCard and add back to sidebar
  const handleDeleteTaskCard = (taskId) => {
    const taskNode = nodes.find(n => n.id === taskId);
    if (taskNode) {
      // Only add back to sidebar if it's not already there
      setSidebarTasks((tasks) => {
        const taskExists = tasks.some(t => t.id === taskNode.id);
        if (!taskExists) {
          return [
            ...tasks,
            { 
              id: taskNode.id, 
              label: taskNode.data.label, 
              department: taskNode.data.department 
            }
          ];
        }
        return tasks;
      });
    }
    setNodes((nds) => nds.filter(n => n.id !== taskId));
    setEdges((eds) => eds.filter(e => e.source !== taskId && e.target !== taskId));
  };

  // Handle drop from sidebar (unassigned tasks)
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;
      const task = JSON.parse(data);
      const { x: flowX, y: flowY } = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Calculate position relative to canvas
      const position = {
        x: flowX,
        y: flowY,
      };

      // Create new task node
      const newNode = {
        id: task.id,
        type: 'taskCard',
        position,
        data: { label: task.label, department: task.department },
        draggable: true,
      };

      // Update nodes and sidebar tasks
      setNodes((nds) => nds.concat(newNode));
      setSidebarTasks((tasks) => tasks.filter(t => t.id !== task.id));
    },
    [setNodes, reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // Pass delete handlers to node data
  const nodesWithHandlers = nodes.map((node) => {
    if (node.type === 'stage') {
      return { ...node, data: { ...node.data, onDelete: () => handleDeleteStage(node.id) } };
    }
    if (node.type === 'taskCard') {
      return { ...node, data: { ...node.data, onDelete: () => handleDeleteTaskCard(node.id) } };
    }
    if (node.type === 'ifElse') {
      return { ...node, data: { ...node.data, onDelete: () => setNodes(nds => nds.filter(n => n.id !== node.id)) } };
    }
    if (node.type === 'errorHandler') {
      return { ...node, data: { ...node.data, onDelete: () => setNodes(nds => nds.filter(n => n.id !== node.id)) } };
    }
    return node;
  });

  // Set all edges to use the custom animated-dotted edge type
  const edgesWithType = edges.map(edge => ({ ...edge, type: 'animated-dotted' }));

  const handleAddIfElse = () => {
    const newId = `ifelse-${Date.now()}`;
    setNodes(nds => nds.concat({
      id: newId,
      type: 'ifElse',
      position: { x: 300, y: 200 },
      data: { label: 'New Condition?' },
    }));
    setTimeout(() => setLabelEdit({ open: true, nodeId: newId, type: 'ifElse', placeholder: 'Set the If/Else condition text', label: '' }), 0);
  };

  const handleAddErrorHandler = () => {
    const newId = `error-${Date.now()}`;
    setNodes(nds => nds.concat({
      id: newId,
      type: 'errorHandler',
      position: { x: 400, y: 300 },
      data: { label: 'Error Handler', description: '' },
    }));
    setTimeout(() => setLabelEdit({ open: true, nodeId: newId, type: 'errorHandler', placeholder: 'Change the Error Handler label', label: '' }), 0);
  };

  const handleLabelEditSave = (newLabel) => {
    setNodes(nds => nds.map(n => n.id === labelEdit.nodeId ? { ...n, data: { ...n.data, label: newLabel } } : n));
    setLabelEdit({ open: false, nodeId: null, type: '', placeholder: '', label: '' });
  };

  const handleLabelEditClose = () => setLabelEdit({ open: false, nodeId: null, type: '', placeholder: '', label: '' });

  // Edge selection handler
  const onEdgeClick = (event, edge) => {
    setSelectedEdge(edge.id);
    setShowEdgeDeleteHelp(true);
  };

  // Keyboard event handler
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdge) {
        setEdges(eds => eds.filter(e => e.id !== selectedEdge));
        setSelectedEdge(null);
        setShowEdgeDeleteHelp(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEdge, setEdges]);

  // Deselect edge on canvas click
  const onPaneClick = () => {
    setSelectedEdge(null);
    setShowEdgeDeleteHelp(false);
  };


  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="md:block">
        <Sidebar
          tasks={sidebarTasks}
          onAddStage={handleAddStage}
          onAddIfElse={handleAddIfElse}
          onAddErrorHandler={handleAddErrorHandler}
        />
      </div>
      {/* Main Canvas */}
      <div className="w-full h-full relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodesWithHandlers}
          edges={edgesWithType}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          panOnDrag
          zoomOnScroll
          panOnScroll
          className="bg-gray-100 dark:bg-gray-900"
          onNodeDragStop={handleNodeDragStop}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onInit={onInit}
        >
          <Background color="#94a3b8" gap={32} />
          <Controls showInteractive={false} />
          {/* Edge selection highlight */}
          {selectedEdge && (
            <>
              {/* Optionally, you can add a visual highlight to the selected edge here */}
            </>
          )}
        </ReactFlow>
        {/* Edge delete help tooltip */}
        {showEdgeDeleteHelp && selectedEdge && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow z-50 text-sm animate-pulse">
            Press <b>Delete</b> key after selecting a connection to remove it.
          </div>
        )}
        {/* Save/Run Buttons */}
        <div className="absolute bottom-6 right-8 flex gap-4">
          <button className="bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded text-sm font-semibold shadow">
            Save Workflow
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-sm font-semibold shadow">
            Run
          </button>
        </div>
      </div>
      {/* Label Edit Modal */}
      {labelEdit.open && (
        <LabelEditModal
          open={labelEdit.open}
          label={labelEdit.label}
          onSave={handleLabelEditSave}
          onClose={handleLabelEditClose}
          placeholder={labelEdit.placeholder}
        />
      )}
    </div>
  );
} 
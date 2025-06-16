import React, { useCallback, useRef, useState } from 'react';
import { ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import StageNode from './nodes/StageNode';
import TaskCardNode from './nodes/TaskCardNode';
import IfElseNode from './nodes/IfElseNode';
import ErrorHandlerNode from './nodes/ErrorHandlerNode';
import Sidebar from './Sidebar';

const nodeTypes = {
  stage: StageNode,
  taskCard: TaskCardNode,
  ifElse: IfElseNode,
  errorHandler: ErrorHandlerNode,
};

const initialSidebarTasks = [
  { id: 'Product-selection', label: 'Product Selection and Review', department: 'Search results and reviews its.' },
  { id: 'Adding-cart', label: 'Adding to Cart/Buy Now', department: 'Product to the cart' },
  { id: 'Payment', label: 'Payment', department: 'Payment' },
  { id: 'Order-confirmation', label: 'Order Confirmation', department: 'Order Confirmation' },
  { id: 'Order-tracking', label: 'Order Tracking', department: 'Order Tracking' },
  { id: 'Order-cancellation', label: 'Order Cancellation', department: 'Order Cancellation' },
  { id: 'Order-returns', label: 'Order Returns', department: 'Order Returns' }
];

const initialNodes = [
  {
    id: 'stage-1',
    type: 'stage',
    position: { x: 100, y: 100 },
    data: { label: 'Customer Onboarding' },
    style: { width: 250, height: 140 },
  },
  {
    id: 'task-1',
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
    id: 'task-2',
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

const initialEdges = [
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
      <div className="bg-slate-800 p-6 rounded shadow-lg min-w-[320px]">
        <div className="mb-3 text-slate-200 font-semibold">{placeholder}</div>
        <input
          className="w-full p-2 rounded bg-slate-900 border border-slate-600 text-slate-100 mb-4"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button className="px-3 py-1 rounded bg-slate-700 text-slate-200" onClick={onClose}>Cancel</button>
          <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={() => onSave(value)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarTasks, setSidebarTasks] = useState(initialSidebarTasks);
  const reactFlowWrapper = useRef(null);
  const stageIdRef = useRef(3); // for unique stage ids
  const taskIdRef = useRef(3); // for unique task ids
  const [labelEdit, setLabelEdit] = useState({ open: false, nodeId: null, type: '', placeholder: '', label: '' });

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
      setSidebarTasks((tasks) => [
        ...tasks,
        { id: `sidebar-${taskIdRef.current++}`, label: taskNode.data.label, department: taskNode.data.department }
      ]);
    }
    setNodes((nds) => nds.filter(n => n.id !== taskId));
    setEdges((eds) => eds.filter(e => e.source !== taskId && e.target !== taskId));
  };

  // Handle connecting nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: false }, eds)),
    [setEdges]
  );

  // Handle drag stop for nodes (for parent assignment logic)
  const onNodeDragStop = useCallback((event, node) => {
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

  // Handle drop from sidebar (unassigned tasks)
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData('application/reactflow');
      if (!data) return;
      const task = JSON.parse(data);
      // Calculate position relative to canvas
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      setNodes((nds) =>
        nds.concat({
          id: `task-${taskIdRef.current++}`,
          type: 'taskCard',
          position,
          data: { label: task.label, department: task.department },
          draggable: true,
        })
      );
      setSidebarTasks((tasks) => tasks.filter(t => t.id !== task.id));
    },
    [setNodes]
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

  return (
    <div className="flex h-screen bg-slate-950">
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
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          panOnDrag
          zoomOnScroll
          panOnScroll
          className="bg-slate-950"
          onNodeDragStop={onNodeDragStop}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background color="#334155" gap={32} />
          <Controls showInteractive={false} />
        </ReactFlow>
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
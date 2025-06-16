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
  { id: 'offer-letter', label: 'Offer Letter Sign Off', department: 'Talent Acquisition' },
  { id: 'prepare-workspace', label: 'Prepare Workspace', department: 'HR Department' },
];

const initialNodes = [
  {
    id: 'stage-1',
    type: 'stage',
    position: { x: 100, y: 100 },
    data: { label: 'Pre-Boarding' },
    style: { width: 220, height: 140 },
  },
  {
    id: 'task-1',
    type: 'taskCard',
    position: { x: 120, y: 160 },
    data: { label: 'Welcome Mail', department: 'HR Department' },
    parentNode: 'stage-1',
    extent: 'parent',
    draggable: true,
  },
  {
    id: 'ifelse-1',
    type: 'ifElse',
    position: { x: 400, y: 140 },
    data: { label: 'Background Check?' },
  },
  {
    id: 'stage-2',
    type: 'stage',
    position: { x: 600, y: 100 },
    data: { label: 'Onboarding Day 1' },
    style: { width: 220, height: 140 },
  },
  {
    id: 'task-2',
    type: 'taskCard',
    position: { x: 620, y: 160 },
    data: { label: 'Orientation & Paper Work', department: 'Admin' },
    parentNode: 'stage-2',
    extent: 'parent',
    draggable: true,
  },
  {
    id: 'error-1',
    type: 'errorHandler',
    position: { x: 200, y: 350 },
    data: { label: 'Fallback: Manual Review', description: 'HR to manually verify details.' },
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

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarTasks, setSidebarTasks] = useState(initialSidebarTasks);
  const reactFlowWrapper = useRef(null);
  const stageIdRef = useRef(3); // for unique stage ids
  const taskIdRef = useRef(3); // for unique task ids

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
    return node;
  });

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <div className="md:block">
        <Sidebar
          tasks={sidebarTasks}
          onAddStage={handleAddStage}
        />
      </div>
      {/* Main Canvas */}
      <div className="flex-1 relative" ref={reactFlowWrapper}>
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
    </div>
  );
} 
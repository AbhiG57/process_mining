import React, { useCallback, useRef, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Node,
  Edge,
  Connection,
  ReactFlowInstance,
  NodeDragHandler,
  EdgeMouseHandler,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  OnDrop,
  OnDragOver,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import StageNode from "./nodes/StageNode";
import TaskCardNode from "./nodes/TaskCardNode";
import IfElseNode from "./nodes/IfElseNode";
import ErrorHandlerNode from "./nodes/ErrorHandlerNode";
import Sidebar from "./Sidebar";
import AnimatedDottedEdge from "./AnimatedDottedEdge";

interface Task {
  id: string;
  label: string;
  department: string;
}

interface NodeData {
  label: string;
  department?: string;
  stageNumber?: number;
  description?: string;
  onDelete?: () => void;
  isNewStage?: boolean;
  isNewTask?: boolean;
}

interface LabelEditState {
  open: boolean;
  nodeId: string | null;
  type: string;
  placeholder: string;
  label: string;
}

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
}

// Utility functions for localStorage persistence
const STORAGE_KEY = "workflow-builder-state";

const saveToLocalStorage = (nodes: Node[], edges: Edge[]): void => {
  try {
    const state: WorkflowState = {
      nodes: nodes.map((node) => ({
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
    console.error("Error saving to localStorage:", error);
  }
};

const loadFromLocalStorage = (): WorkflowState | null => {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      const { nodes, edges } = JSON.parse(savedState);
      return { nodes, edges };
    }
  } catch (error) {
    console.error("Error loading from localStorage:", error);
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
  "animated-dotted": AnimatedDottedEdge,
};

const initialSidebarTasks: Task[] = [
  {
    id: "1",
    label: "Product Selection and Review",
    department: "Search results and reviews its.",
  },
  {
    id: "2",
    label: "Adding to Cart/Buy Now",
    department: "Product to the cart",
  },
  { id: "3", label: "Payment", department: "Payment" },
  { id: "4", label: "Order Confirmation", department: "Order Confirmation" },
  { id: "5", label: "Order Tracking", department: "Order Tracking" },
  { id: "6", label: "Order Cancellation", department: "Order Cancellation" },
  { id: "7", label: "Order Returns", department: "Order Returns" },
];

const initialNodesBase: Node[] = [
  {
    id: "stage-1",
    type: "stage",
    position: { x: 100, y: 100 },
    data: { label: "Customer Onboarding", stageNumber: 1 },
    style: { width: 250, height: 140 },
  },
  {
    id: "ifelse-1",
    type: "ifElse",
    position: { x: 400, y: 140 },
    data: { label: "Loged In ?" },
  },
  {
    id: "stage-2",
    type: "stage",
    position: { x: 600, y: 100 },
    data: { label: "Explore Products", stageNumber: 2 },
    style: { width: 220, height: 140 },
  },
  {
    id: "8",
    type: "taskCard",
    position: { x: 120, y: 160 },
    data: {
      label: "Account Login / Creation",
      department: "Customer Account Creation",
    },
    draggable: true,
  },
  {
    id: "9",
    type: "taskCard",
    position: { x: 620, y: 160 },
    data: { label: "Product Search", department: "Browse Desired Products." },
    draggable: true,
  },
  {
    id: "error-1",
    type: "errorHandler",
    position: { x: 350, y: 350 },
    data: {
      label: "Account Login failed",
      description: "Please Contact Customer Support",
    },
  },
];

const initialEdgesBase: Edge[] = [
  { id: "e1-2", source: "stage-1", target: "ifelse-1", animated: false },
  { id: "e2-3", source: "ifelse-1", target: "stage-2", animated: false },
  {
    id: "e3-4",
    source: "ifelse-1",
    target: "error-1",
    animated: false,
    style: { stroke: "#f87171" },
  },
];

function isInsideStage(stageNode: Node, position: { x: number; y: number }): boolean {
  // Check if a point is inside the bounding box of a stage node
  const { x, y } = stageNode.position;
  const width = (stageNode.style as any)?.width || 220;
  const height = (stageNode.style as any)?.height || 140;
  return (
    position.x > x &&
    position.x < x + width &&
    position.y > y &&
    position.y < y + height
  );
}

interface LabelEditModalProps {
  open: boolean;
  label: string;
  onSave: (label: string) => void;
  onClose: () => void;
  placeholder: string;
}

// Add a simple modal for label editing
function LabelEditModal({ open, label, onSave, onClose, placeholder }: LabelEditModalProps): JSX.Element | null {
  const [value, setValue] = useState<string>(label || "");
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg min-w-[320px]">
        <div className="mb-3 text-gray-900 dark:text-gray-100 font-semibold">
          {placeholder}
        </div>
        <input
          className="w-full p-2 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 mb-4"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <button
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => onSave(value)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WorkflowBuilder(): JSX.Element {
  // Load initial state from localStorage or use defaults
  const savedState = loadFromLocalStorage();
  const initialNodes = savedState?.nodes || initialNodesBase;
  const initialEdges = savedState?.edges || initialEdgesBase;
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const onInit = (instance: ReactFlowInstance): void => {
    console.log("React Flow Ready:", instance);
    setReactFlowInstance(instance);
  };

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [sidebarTasks, setSidebarTasks] = useState<Task[]>(() => {
    // Filter out tasks that are already on the canvas
    const taskNodes = initialNodes.filter((node) => node.type === "taskCard");
    return initialSidebarTasks.filter(
      (task) => !taskNodes.some((node) => node.data.label === task.label)
    );
  });
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const stageIdRef = useRef<number>(3);
  const taskIdRef = useRef<number>(3);
  const [labelEdit, setLabelEdit] = useState<LabelEditState>({
    open: false,
    nodeId: null,
    type: "",
    placeholder: "",
    label: "",
  });
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [showEdgeDeleteHelp, setShowEdgeDeleteHelp] = useState<boolean>(false);
  // Animation state for new nodes
  const [newStageId, setNewStageId] = useState<string | null>(null);
  const [newTaskId, setNewTaskId] = useState<string | null>(null);
  const stageNumberRef = useRef<number>(1); // For unique, persistent stage numbers

  // Save to localStorage whenever nodes or edges change
  useEffect(() => {
    saveToLocalStorage(nodes, edges);
  }, [nodes, edges]);

  // Enhanced node change handler
  const handleNodesChange: OnNodesChange = useCallback(
    (changes) => {
      onNodesChange(changes);
    },
    [onNodesChange]
  );

  // Enhanced edge change handler
  const handleEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      onEdgesChange(changes);
    },
    [onEdgesChange]
  );

  // Enhanced node drag stop handler
  const handleNodeDragStop: NodeDragHandler = useCallback(
    (event, node) => {
      if (node.type !== "taskCard") return;

      // Find if dropped inside a stage
      const stage = nodes.find(
        (n) => n.type === "stage" && isInsideStage(n, node.position)
      );

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            if (stage) {
              return {
                ...n,
                parentNode: stage.id,
                extent: "parent",
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
    },
    [nodes, setNodes]
  );

  // Enhanced connect handler
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: false }, eds));
    },
    [setEdges]
  );

  // Pass delete handlers to node data
  const nodesWithHandlers = nodes.map((node, idx) => {
    let extra: Partial<NodeData> = {};
    if (node.type === "stage" && node.id === newStageId)
      extra.isNewStage = true;
    if (node.type === "taskCard" && node.id === newTaskId)
      extra.isNewTask = true;
    if (node.type === "stage") {
      // Assign stageNumber if not present
      let stageNumber = (node.data as NodeData).stageNumber;
      if (typeof stageNumber !== "number") {
        // Find the index among all stage nodes (sorted by appearance)
        const stageNodes = nodes.filter((n) => n.type === "stage");
        stageNumber = stageNodes.findIndex((n) => n.id === node.id) + 1;
      }
      return {
        ...node,
        data: {
          ...node.data,
          ...extra,
          onDelete: () => handleDeleteStage(node.id),
          stageNumber,
        },
      };
    }
    if (node.type === "taskCard") {
      return {
        ...node,
        data: {
          ...node.data,
          ...extra,
          onDelete: () => handleDeleteTaskCard(node.id),
        },
      };
    }
    if (node.type === "ifElse") {
      return {
        ...node,
        data: {
          ...node.data,
          onDelete: () =>
            setNodes((nds) => nds.filter((n) => n.id !== node.id)),
        },
      };
    }
    if (node.type === "errorHandler") {
      return {
        ...node,
        data: {
          ...node.data,
          onDelete: () =>
            setNodes((nds) => nds.filter((n) => n.id !== node.id)),
        },
      };
    }
    return node;
  });

  // Set all edges to use the custom animated-dotted edge type
  const edgesWithType = edges.map((edge) => ({
    ...edge,
    type: "animated-dotted",
  }));

  const handleAddIfElse = (): void => {
    const newId = `ifelse-${Date.now()}`;
    setNodes((nds) =>
      nds.concat({
        id: newId,
        type: "ifElse",
        position: { x: 300, y: 200 },
        data: { label: "New Condition?" },
      })
    );
    setTimeout(
      () =>
        setLabelEdit({
          open: true,
          nodeId: newId,
          type: "ifElse",
          placeholder: "Set the If/Else condition text",
          label: "",
        }),
      0
    );
  };

  const handleAddErrorHandler = (): void => {
    const newId = `error-${Date.now()}`;
    setNodes((nds) =>
      nds.concat({
        id: newId,
        type: "errorHandler",
        position: { x: 400, y: 300 },
        data: { label: "Error Handler", description: "" },
      })
    );
    setTimeout(
      () =>
        setLabelEdit({
          open: true,
          nodeId: newId,
          type: "errorHandler",
          placeholder: "Change the Error Handler label",
          label: "",
        }),
      0
    );
  };

  const handleLabelEditSave = (newLabel: string): void => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === labelEdit.nodeId
          ? { ...n, data: { ...n.data, label: newLabel } }
          : n
      )
    );
    setLabelEdit({
      open: false,
      nodeId: null,
      type: "",
      placeholder: "",
      label: "",
    });
  };

  const handleLabelEditClose = (): void =>
    setLabelEdit({
      open: false,
      nodeId: null,
      type: "",
      placeholder: "",
      label: "",
    });

  // Edge selection handler
  const onEdgeClick: EdgeMouseHandler = (event, edge) => {
    setSelectedEdge(edge.id);
    setShowEdgeDeleteHelp(true);
  };

  // Keyboard event handler
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === "Delete" || e.key === "Backspace") && selectedEdge) {
        setEdges((eds) => eds.filter((e) => e.id !== selectedEdge));
        setSelectedEdge(null);
        setShowEdgeDeleteHelp(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedEdge, setEdges]);

  const handleDragStop: NodeDragHandler = useCallback(
    (event, draggedNode) => {
      if (draggedNode.type !== "taskCard") return;

      setNodes((prevNodes) => {
        const oldNode = prevNodes.find((n) => n.id === draggedNode.id);
        if (!oldNode) return prevNodes;

        const previousParent = prevNodes.find((n) => n.id === oldNode.parentId);

        // STEP 1: Get ABSOLUTE position of the dragged node
        const absX = previousParent
          ? oldNode.position.x + previousParent.position.x
          : oldNode.position.x;
        const absY = previousParent
          ? oldNode.position.y + previousParent.position.y
          : oldNode.position.y;

        const width = oldNode.measured?.width ?? 120;
        const height = oldNode.measured?.height ?? 80;

        const taskBox = { x: absX, y: absY, width, height };

        // STEP 2: Find the new parent (if any)
        const newParent = prevNodes.find(
          (node) =>
            node.type === "stage" &&
            nodeInsideParent(
              taskBox,
              node.position,
              node.measured?.height,
              node.measured?.width
            )
        );

        return prevNodes.map((n) => {
          if (n.id !== draggedNode.id) return n;

          // CASE 1: Moved into a new parent
          if (newParent && newParent.id !== oldNode.parentId) {
            return {
              ...n,
              parentId: newParent.id,
              position: {
                ...n.position,
                x: absX - newParent.position.x,
                y: absY - newParent.position.y,
              },
            };
          }

          // CASE 2: Moved out of a parent
          if (!newParent && oldNode.parentId) {
            return {
              ...n,
              parentId: null,
              position: {
                ...n.position,
                x: absX,
                y: absY,
              },
            };
          }

          // CASE 3: Still in same parent → preserve as-is
          return n;
        });
      });
    },
    [setNodes]
  );

  // Deselect edge on canvas click
  const onPaneClick = (): void => {
    setSelectedEdge(null);
    setShowEdgeDeleteHelp(false);
  };

  function nodeInsideParent(childBox: { x: number; y: number; width: number; height: number }, parentPos: { x: number; y: number }, parentHeight: number, parentWidth: number): boolean {
    return (
      childBox.x >= parentPos.x &&
      childBox.y >= parentPos.y &&
      childBox.x + childBox.width <= parentPos.x + parentWidth &&
      childBox.y + childBox.height <= parentPos.y + parentHeight
    );
  }

  // Add new Stage node (without useRef, use maxStageNumber + 1)
  const handleAddStage = (): void => {
    const newId = `stage-${Date.now()}`;

    // Compute the next available stage number
    const usedStageNumbers = nodes
      .filter(
        (n) => n.type === "stage" && typeof (n.data as NodeData).stageNumber === "number"
      )
      .map((n) => (n.data as NodeData).stageNumber);
    const maxStageNumber =
      usedStageNumbers.length > 0 ? Math.max(...usedStageNumbers) : 0;
    const stageNumber = maxStageNumber + 1;
    setNodes((nds) =>
      nds.concat({
        id: newId,
        type: "stage",
        position: { x: 200, y: 200 },
        data: { label: `New Stage`, stageNumber },
        style: { width: 220, height: 140 },
      })
    );
    setTimeout(
      () =>
        setLabelEdit({
          open: true,
          nodeId: newId,
          type: "stage",
          placeholder: "Rename this Stage",
          label: "",
        }),
      0
    );
  };

  // Delete Stage and its children
  const handleDeleteStage = (stageId: string): void => {
    setNodes((nds) => {
      // Remove the stage and its children
      const filtered = nds.filter(
        (n) => n.id !== stageId && n.parentNode !== stageId
      );
      // Get all stage nodes in their current order
      const stageNodes = filtered.filter((n) => n.type === "stage");
      // Reassign stage numbers sequentially
      let nextNumber = 1;
      const updated = filtered.map((n) => {
        if (n.type === "stage") {
          return {
            ...n,
            data: {
              ...n.data,
              stageNumber: nextNumber++,
            },
          };
        }
        return n;
      });
      return updated;
    });
    setEdges((eds) =>
      eds.filter((e) => e.source !== stageId && e.target !== stageId)
    );
  };

  // Delete TaskCard and add back to sidebar
  const handleDeleteTaskCard = (taskId: string): void => {
    const taskNode = nodes.find((n) => n.id === taskId);
    if (taskNode) {
      // Only add back to sidebar if it's not already there
      setSidebarTasks((tasks) => {
        const taskExists = tasks.some((t) => t.id === taskNode.id);
        if (!taskExists) {
          return [
            ...tasks,
            {
              id: taskNode.id,
              label: taskNode.data.label,
              department: taskNode.data.department,
            },
          ];
        }
        return tasks;
      });
    }
    setNodes((nds) => nds.filter((n) => n.id !== taskId));
    setEdges((eds) =>
      eds.filter((e) => e.source !== taskId && e.target !== taskId)
    );
  };

  // Handle drop from sidebar (unassigned tasks)
  const onDrop: OnDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!reactFlowWrapper.current || !reactFlowInstance) return;
      
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const data = event.dataTransfer.getData("application/reactflow");
      if (!data) return;
      const task: Task = JSON.parse(data);
      const { x: flowX, y: flowY } = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const position = {
        x: flowX,
        y: flowY,
      };
      const newNode: Node = {
        id: task.id,
        type: "taskCard",
        position,
        data: { label: task.label, department: task.department },
        draggable: true,
      };
      setNodes((nds) => nds.concat(newNode));
      setSidebarTasks((tasks) => tasks.filter((t) => t.id !== task.id));
      setNewTaskId(task.id);
      setTimeout(() => setNewTaskId(null), 400);
      // Call handleDragStop for sidebar drop
      handleDragStop(event as any, newNode);
    },
    [setNodes, reactFlowInstance, handleDragStop]
  );

  const onDragOver: OnDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

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
          onNodeDragStop={handleDragStop}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onEdgeClick={onEdgeClick}
          onPaneClick={onPaneClick}
          onInit={onInit}
          connectionLineType="bezier"
          connectionLineStyle={{
            stroke: "#38bdf8",
            strokeWidth: 3,
            strokeDasharray: "6,8",
            animation: "dotted-flow 1.2s linear infinite",
          }}
          snapToGrid={true}
          snapGrid={[16, 16]}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={2}
          onlyRenderVisibleElements={true}
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
      <style>{`
        @keyframes pop-in {
          0% { opacity: 0; transform: scale(0.7); }
          80% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-pop-in {
          animation: pop-in 0.3s ease-out;
        }
        @keyframes slide-in {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); box-shadow: 0 0 0 0 #3b82f6; }
          80% { opacity: 1; transform: translateY(-4px) scale(1.03); box-shadow: 0 0 0 6px #3b82f6; }
          100% { opacity: 1; transform: translateY(0) scale(1); box-shadow: 0 0 0 0 #3b82f6; }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(.22,1,.36,1);
        }
        .highlight {
          box-shadow: 0 0 0 3px #3b82f6;
        }
        .edge-glow path {
          stroke: #38bdf8 !important;
          filter: drop-shadow(0 0 6px #38bdf8);
          stroke-width: 3 !important;
        }
        .node-added {
          box-shadow: 0 0 0 4px #38bdf8, 0 2px 12px 0 rgba(56,189,248,0.15);
          transition: box-shadow 0.4s cubic-bezier(.22,1,.36,1);
        }
      `}</style>
    </div>
  );
} 
import { Handle, Position, NodeProps } from '@xyflow/react';

interface IfElseNodeData {
  label: string;
  onDelete: () => void;
}

interface IfElseNodeProps extends NodeProps {
  data: IfElseNodeData;
}

export default function IfElseNode({ data }: IfElseNodeProps): JSX.Element {
  return (
    <div className="w-20 h-20 flex items-center justify-center relative text-xs">
      {/* Input handle (left) */}
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-cyan-500" />
      {/* Output handles (top-right and bottom-right) */}
      <Handle type="source" position={Position.Top} id="out1" style={{ right: -8, top: 8 }} className="!w-2 !h-2 !bg-cyan-500 absolute" />
      <Handle type="source" position={Position.Bottom} id="out2" style={{ right: -8, bottom: 8 }} className="!w-2 !h-2 !bg-cyan-500 absolute" />
      <div className="w-full h-full bg-white dark:bg-gray-700 border-2 border-cyan-500 transform rotate-45 flex items-center justify-center">
        <span className="transform -rotate-45 text-gray-900 dark:text-gray-100 font-medium text-xs text-center px-1">
          {data.label}
        </span>
        <button className="absolute top-0 right-0 z-10 text-gray-400 hover:text-red-500 text-xs p-1 transform -rotate-45" onClick={data.onDelete}>
          ×
        </button>
      </div>
    </div>
  );
} 
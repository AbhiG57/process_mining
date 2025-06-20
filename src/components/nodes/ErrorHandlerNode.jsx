import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Handle, Position, NodeResizeControl } from '@xyflow/react';

export default function ErrorHandlerNode({ data,selected }) {
  return (
    <div className="rounded-lg bg-white dark:bg-red-900 border-2 border-red-200 dark:border-red-600 shadow-lg p-3 min-w-[140px] min-h-[60px] flex flex-col relative text-xs w-full h-full">
      <NodeResizeControl style={{width: '10px', height: '10px',backgroundColor: 'red'}} color="#3b82f6" isVisible={selected} minWidth={120} minHeight={60} />
     
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-red-500" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-red-500" />
      <div className="flex items-center gap-2 mb-1 justify-between">
        <span className="flex items-center gap-1">
          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 dark:text-red-300 text-base" />
          <span className="font-bold text-gray-900 dark:text-red-100 text-xs">{data.label}</span>
        </span>
        <button className="text-gray-400 hover:text-red-500 text-xs p-1" onClick={data.onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="flex-1 border-2 border-dashed border-red-200 dark:border-red-400 rounded bg-red-50 dark:bg-red-950/60 p-1 text-[10px] text-gray-600 dark:text-red-200">
        {data.description}
      </div>
    </div>
  );
} 
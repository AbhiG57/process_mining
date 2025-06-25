import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Handle, Position, NodeResizeControl } from '@xyflow/react';

export default function StageNode({ data, selected }) {
  return (
    <div
      className={
        "flex flex-col rounded-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg p-3 min-w-[180px] min-h-[90px] relative text-xs w-full h-full" +
        (data.isNewStage ? " node-added animate-pop-in" : "")
      }
    >
      {/* Stage Number Badge */}
      {typeof data.stageNumber === 'number' && (
        <div className="absolute -top-2 -left-2 px-2 py-0.5 bg-gray-200 text-black font-bold text-xs rounded shadow border border-gray-300 select-none z-10">
          Stage {data.stageNumber}
        </div>
      )}
      <NodeResizeControl style={{width: '10px', height: '10px',backgroundColor: 'red'}} color="#3b82f6" isVisible={selected} minWidth={120} minHeight={60} />
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-blue-500" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-blue-500" />
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-slate-900 dark:text-slate-100 text-xs flex items-center gap-2">
          <FontAwesomeIcon icon={faLayerGroup} className="text-blue-400 text-base" />
          {data.label}
        </span>
        <button className="text-slate-400 hover:text-red-400 text-base p-1" onClick={data.onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded bg-slate-50 dark:bg-slate-900/60 p-1 w-full flex-1">
        {data.children}
      </div>
    </div>
  );
} 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Handle, Position } from '@xyflow/react';

export default function StageNode({ data }) {
  return (
    <div className="rounded-lg bg-slate-800 border-2 border-slate-600 shadow-lg p-3 min-w-[180px] min-h-[90px] flex flex-col relative text-xs">
      <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-blue-400" />
      <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-blue-400" />
      <div className="flex items-center justify-between mb-1">
        <span className="font-bold text-slate-100 text-xs flex items-center gap-2">
          <FontAwesomeIcon icon={faLayerGroup} className="text-blue-400 text-base" />
          {data.label}
        </span>
        <button className="text-slate-400 hover:text-red-400 text-base p-1" onClick={data.onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="flex-1 border-2 border-dashed border-slate-700 rounded bg-slate-900/60 p-1">
        {data.children}
      </div>
    </div>
  );
} 
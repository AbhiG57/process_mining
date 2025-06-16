import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TaskCardNode({ data }) {
  return (
    <div className="rounded bg-slate-700 border border-slate-500 shadow p-2 min-w-[100px] flex flex-col gap-1 relative">
      <div className="flex items-center gap-2 justify-between">
        <span className="flex items-center gap-1 text-xs text-slate-100 font-semibold">
          <FontAwesomeIcon icon={faEnvelope} className="text-green-400 text-sm" />
          {data.label}
        </span>
        <button className="text-slate-400 hover:text-red-400 text-xs p-1" onClick={data.onDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <div className="text-[10px] text-slate-400">{data.department}</div>
    </div>
  );
} 
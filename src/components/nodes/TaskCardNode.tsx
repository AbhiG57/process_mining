import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTrash } from '@fortawesome/free-solid-svg-icons';

interface TaskCardNodeData {
  label: string;
  department: string;
  isNewTask?: boolean;
  onDelete: () => void;
}

interface TaskCardNodeProps {
  data: TaskCardNodeData;
}

export default function TaskCardNode({ data }: TaskCardNodeProps): JSX.Element {
  return (
    <div
      className={
        "rounded dark:bg-slate-700 border dark:border-slate-500 shadow p-2 min-w-[100px] flex flex-col gap-1 relative" +
        (data.isNewTask ? " node-added animate-slide-in highlight" : "")
      }
    >
      <div className="flex items-center gap-2 justify-between">
        <span className="flex items-center gap-1 text-xs dark:text-slate-100 font-semibold text-black">
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
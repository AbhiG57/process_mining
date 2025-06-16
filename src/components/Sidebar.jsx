import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faCodeBranch, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ tasks, onAddStage, onAddIfElse, onAddErrorHandler }) {
  return (
    <div className="w-60 bg-slate-900 border-r border-slate-800 p-3 flex flex-col gap-5 h-full">
      <div>
        <div className="text-slate-400 font-semibold mb-1 text-xs">Workflow Elements</div>
        <div className="flex flex-col gap-2">
          <button
            className="flex items-center gap-2 p-2 rounded bg-slate-800 text-xs text-slate-100 hover:bg-blue-900 transition"
            onClick={onAddStage}
          >
            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-400 text-base" />
            Stage
          </button>
          <button
            className="flex items-center gap-2 p-2 rounded bg-slate-800 text-xs text-slate-100 hover:bg-cyan-900 transition"
            onClick={onAddIfElse}
          >
            <FontAwesomeIcon icon={faCodeBranch} className="text-cyan-400 text-base" />
            If/Else
          </button>
          <button
            className="flex items-center gap-2 p-2 rounded bg-slate-800 text-xs text-slate-100 hover:bg-red-900 transition"
            onClick={onAddErrorHandler}
          >
            <FontAwesomeIcon icon={faExclamationCircle} className="text-red-400 text-base" />
            Error Handler
          </button>
        </div>
      </div>
      <div>
        <div className="text-slate-400 font-semibold mb-1 text-xs">Unassigned Tasks</div>
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="rounded bg-slate-700 border border-slate-500 shadow p-2 cursor-move text-xs"
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', JSON.stringify(task));
                e.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="font-semibold text-slate-100 text-xs">{task.label}</div>
              <div className="text-[10px] text-slate-400">{task.department}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
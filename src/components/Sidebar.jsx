import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faCodeBranch, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({ tasks, onAddStage, onAddIfElse, onAddErrorHandler }) {
  return (
    <div className="w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-5 h-full">
      <div>
        <div className="text-gray-600 dark:text-gray-300 font-semibold mb-1 text-xs">Process Elements</div>
        <div className="flex flex-col gap-2">
          <button
            className="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
            onClick={onAddStage}
          >
            <FontAwesomeIcon icon={faLayerGroup} className="text-blue-500 dark:text-blue-400 text-base" />
            Stage
          </button>
          <button
            className="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-100 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition"
            onClick={onAddIfElse}
          >
            <FontAwesomeIcon icon={faCodeBranch} className="text-cyan-500 dark:text-cyan-400 text-base" />
            If/Else
          </button>
          <button
            className="flex items-center gap-2 p-2 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-900 dark:text-gray-100 hover:bg-red-100 dark:hover:bg-red-900 transition"
            onClick={onAddErrorHandler}
          >
            <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 dark:text-red-400 text-base" />
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
              className="rounded bg-slate-700 border border-slate-500 shadow p-2 cursor-grab text-xs transition-transform duration-150 hover:scale-105 hover:bg-slate-600 relative group"
              draggable
              onDragStart={e => {
                e.dataTransfer.setData('application/reactflow', JSON.stringify(task));
                e.dataTransfer.effectAllowed = 'move';
              }}
            >
              <div className="font-semibold text-slate-100 text-xs">{task.label}</div>
              <div className="text-[10px] text-slate-400">{task.department}</div>
              {/* Tooltip */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-7 bg-gray-900 text-white text-[11px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-20 shadow">
                Drag to canvas
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
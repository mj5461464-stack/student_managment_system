import { Calendar, Check, Trash2, Clock, Flag, AlertCircle } from 'lucide-react';
import type { Task } from '@/types/task';
import { formatDate, getDeadlineStatus } from '@/utils/date';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<
  Task['priority'],
  { color: string; bgColor: string; dot: string; label: string; border: string }
> = {
  low: { color: 'text-blue-700', bgColor: 'bg-blue-100', dot: 'bg-blue-500', label: 'Low', border: 'border-l-blue-500' },
  medium: { color: 'text-amber-700', bgColor: 'bg-amber-100', dot: 'bg-amber-500', label: 'Medium', border: 'border-l-amber-500' },
  high: { color: 'text-red-700', bgColor: 'bg-red-100', dot: 'bg-red-500', label: 'High', border: 'border-l-red-500' },
};

export default function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const priority = priorityConfig[task.priority];

  return (
    <div
      className={`group rounded-xl border border-l-4 bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        task.completed
          ? 'border-slate-100 border-l-slate-300 opacity-75'
          : deadlineStatus.label === 'Overdue'
            ? `border-red-100 ${priority.border}`
            : `border-slate-200 ${priority.border}`
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all ${
            task.completed
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-slate-300 bg-white hover:border-emerald-400'
          }`}
          aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.completed && <Check className="h-3.5 w-3.5" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`font-medium leading-snug ${
                task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
              }`}
            >
              {task.title}
            </h4>
            <button
              onClick={() => onDelete(task.id)}
              className="flex-shrink-0 rounded-lg p-1 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {task.description && (
            <p
              className={`mt-1 text-sm leading-relaxed ${
                task.completed ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                task.completed
                  ? 'bg-slate-100 text-slate-400'
                  : deadlineStatus.className
              }`}
            >
              {deadlineStatus.label === 'Overdue' ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <Clock className="h-3 w-3" />
              )}
              {deadlineStatus.label}
            </span>

            {task.deadline && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <Calendar className="h-3 w-3" />
                {formatDate(task.deadline)}
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                task.completed
                  ? 'bg-slate-100 text-slate-400'
                  : `${priority.bgColor} ${priority.color}`
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${
                task.completed ? 'bg-slate-300' : priority.dot
              }`} />
              {priority.label} priority
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

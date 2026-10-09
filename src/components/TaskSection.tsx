import { Clock, CheckCircle2 } from 'lucide-react';
import type { Task } from '@/types/task';
import TaskCard from './TaskCard';

interface TaskSectionProps {
  title: string;
  icon: 'pending' | 'completed';
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskSection({
  title,
  icon,
  tasks,
  onToggle,
  onDelete,
}: TaskSectionProps) {
  const Icon = icon === 'pending' ? Clock : CheckCircle2;
  const accentColor = icon === 'pending' ? 'text-blue-600' : 'text-emerald-600';
  const count = tasks.length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Icon className={`h-5 w-5 ${accentColor}`} />
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        <span className="ml-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500">
          {count}
        </span>
      </div>

      {count === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center">
          <p className="text-sm text-slate-400">
            {icon === 'pending'
              ? 'No pending tasks. Add one above to get started!'
              : 'No completed tasks yet. Mark a task as done to see it here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

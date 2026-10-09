import { useState } from 'react';
import { Plus, Calendar, Flag, X } from 'lucide-react';
import type { TaskPriority } from '@/types/task';

interface AddTaskFormProps {
  onAdd: (task: {
    title: string;
    description: string;
    deadline: string;
    priority: TaskPriority;
  }) => Promise<void>;
}

export default function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setPriority('medium');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        title: title.trim(),
        description: description.trim(),
        deadline,
        priority,
      });
      resetForm();
      setIsOpen(false);
    } catch {
      setError('Failed to add task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const priorityColors: Record<TaskPriority, string> = {
    low: 'text-blue-600 border-blue-200 bg-blue-50',
    medium: 'text-amber-600 border-amber-200 bg-amber-50',
    high: 'text-red-600 border-red-200 bg-red-50',
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white py-4 font-medium text-slate-500 transition-all hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600"
      >
        <Plus className="h-5 w-5 transition-transform group-hover:scale-110" />
        Add New Task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">New Task</h3>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsOpen(false);
          }}
          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What do you need to do?"
          className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          autoFocus
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a description (optional)"
          rows={2}
          className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <Calendar className="h-4 w-4 text-slate-400" />
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex-1">
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-600">
              <Flag className="h-4 w-4 text-slate-400" />
              Priority
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-all ${
                    priority === p
                      ? priorityColors[p]
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Task'}
          </button>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsOpen(false);
            }}
            className="rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-600 transition-all hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}

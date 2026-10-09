import { useEffect, useMemo, useState, useCallback } from 'react';
import { GraduationCap, ListChecks, Loader2, SearchX } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Task, TaskPriority } from '@/types/task';
import AddTaskForm from '@/components/AddTaskForm';
import TaskSection from '@/components/TaskSection';
import SearchFilter from '@/components/SearchFilter';
import type { StatusFilter, PriorityFilter } from '@/components/SearchFilter';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const fetchTasks = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError('Failed to load tasks. Please refresh the page.');
      return;
    }
    setTasks((data as Task[]) ?? []);
    setError(null);
  }, []);

  useEffect(() => {
    (async () => {
      await fetchTasks();
      setLoading(false);
    })();
  }, [fetchTasks]);

  const handleAdd = async (newTask: {
    title: string;
    description: string;
    deadline: string;
    priority: TaskPriority;
  }) => {
    const { data, error: insertError } = await supabase
      .from('tasks')
      .insert({
        title: newTask.title,
        description: newTask.description || null,
        deadline: newTask.deadline || null,
        priority: newTask.priority,
      })
      .select()
      .single();

    if (insertError) throw new Error(insertError.message);
    if (data) setTasks((prev) => [data as Task, ...prev]);
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const newCompleted = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );

    const { error: updateError } = await supabase
      .from('tasks')
      .update({ completed: newCompleted })
      .eq('id', id);

    if (updateError) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: task.completed } : t))
      );
    }
  };

  const handleDelete = async (id: string) => {
    const prevTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));

    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (deleteError) {
      setTasks(prevTasks);
    }
  };

  // Apply search + priority filter to all tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search query — matches title or description
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      // Priority filter
      if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
      return true;
    });
  }, [tasks, searchQuery, priorityFilter]);

  // Split filtered tasks into pending and completed based on status filter
  const pendingTasks = useMemo(() => {
    if (statusFilter === 'completed') return [];
    return filteredTasks
      .filter((t) => !t.completed)
      .sort((a, b) => {
        if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
        if (a.deadline) return -1;
        if (b.deadline) return 1;
        return 0;
      });
  }, [filteredTasks, statusFilter]);

  const completedTasks = useMemo(() => {
    if (statusFilter === 'pending') return [];
    return filteredTasks.filter((t) => t.completed);
  }, [filteredTasks, statusFilter]);

  const hasActiveFilters =
    searchQuery !== '' || statusFilter !== 'all' || priorityFilter !== 'all';
  const totalVisible = pendingTasks.length + completedTasks.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">StudyTask</h1>
            <p className="text-sm text-slate-500">Manage your assignments and deadlines</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Stats bar */}
        <div className="mb-6 flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm">
            <ListChecks className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-slate-700">
              {tasks.filter((t) => !t.completed).length}
            </span>
            <span className="text-slate-400">pending</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="text-sm">
            <span className="font-medium text-slate-700">
              {tasks.filter((t) => t.completed).length}
            </span>
            <span className="text-slate-400"> completed</span>
          </div>
          {tasks.length > 0 && (
            <>
              <div className="h-4 w-px bg-slate-200" />
              <div className="text-sm text-slate-400">
                {Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100)}% done
              </div>
            </>
          )}
        </div>

        {/* Add task form */}
        <div className="mb-6">
          <AddTaskForm onAdd={handleAdd} />
        </div>

        {/* Search & filter */}
        {tasks.length > 0 && (
          <div className="mb-6">
            <SearchFilter
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
              hasTasks={tasks.length > 0}
            />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : totalVisible === 0 && hasActiveFilters ? (
          /* No results from active filters */
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center">
            <SearchX className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-500">No tasks match your filters</p>
            <p className="mt-1 text-xs text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-8">
            <TaskSection
              title="Pending Tasks"
              icon="pending"
              tasks={pendingTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
            <TaskSection
              title="Completed Tasks"
              icon="completed"
              tasks={completedTasks}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-4 text-center text-sm text-slate-400 sm:px-6">
          StudyTask — Stay on top of your deadlines
        </div>
      </footer>
    </div>
  );
}

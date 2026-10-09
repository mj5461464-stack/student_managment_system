import { Search, X, SlidersHorizontal } from 'lucide-react';

export type StatusFilter = 'all' | 'pending' | 'completed';
export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

interface SearchFilterProps {
  searchQuery: string;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (value: PriorityFilter) => void;
  hasTasks: boolean;
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

const priorityOptions: { value: PriorityFilter; label: string; dot?: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'high', label: 'High', dot: 'bg-red-500' },
  { value: 'medium', label: 'Medium', dot: 'bg-amber-500' },
  { value: 'low', label: 'Low', dot: 'bg-blue-500' },
];

export default function SearchFilter({
  searchQuery,
  statusFilter,
  priorityFilter,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  hasTasks,
}: SearchFilterProps) {
  const hasActiveFilters =
    searchQuery !== '' || statusFilter !== 'all' || priorityFilter !== 'all';

  const clearAll = () => {
    onSearchChange('');
    onStatusChange('all');
    onPriorityChange('all');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Search bar */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-9 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 transition-colors hover:text-slate-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mt-3 space-y-2.5">
        {/* Status filter */}
        <div className="flex items-center gap-2">
          <span className="flex w-14 flex-shrink-0 items-center gap-1 text-xs font-medium text-slate-500">
            Status
          </span>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onStatusChange(opt.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  statusFilter === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-2">
          <span className="flex w-14 flex-shrink-0 items-center gap-1 text-xs font-medium text-slate-500">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Priority
          </span>
          <div className="flex flex-wrap gap-2">
            {priorityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => onPriorityChange(opt.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  priorityFilter === opt.value
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt.dot && (
                  <span className={`h-2 w-2 rounded-full ${opt.dot}`} />
                )}
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filter indicator */}
      {hasActiveFilters && hasTasks && (
        <button
          onClick={clearAll}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  );
}

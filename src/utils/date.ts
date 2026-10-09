export function getDaysUntil(deadline: string | null): number | null {
  if (!deadline) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(date: string | null): string {
  if (!date) return 'No deadline';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getDeadlineStatus(deadline: string | null): {
  label: string;
  className: string;
} {
  const days = getDaysUntil(deadline);
  if (days === null) return { label: 'No deadline', className: 'text-slate-400' };
  if (days < 0) return { label: 'Overdue', className: 'text-red-600 bg-red-50' };
  if (days === 0) return { label: 'Due today', className: 'text-amber-600 bg-amber-50' };
  if (days === 1) return { label: 'Due tomorrow', className: 'text-amber-600 bg-amber-50' };
  if (days <= 3) return { label: `${days} days left`, className: 'text-amber-600 bg-amber-50' };
  return { label: `${days} days left`, className: 'text-emerald-600 bg-emerald-50' };
}

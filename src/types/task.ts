export interface Task {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';

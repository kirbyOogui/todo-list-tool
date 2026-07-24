export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  dueDate: number | null;
  tags: string[];
}

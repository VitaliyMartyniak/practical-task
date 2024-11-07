export interface Todo {
  id: string;
  description: string;
  dueDate: Date | null;
  creationDate: Date;
  completed: boolean;
  completionDate: Date | null;
}

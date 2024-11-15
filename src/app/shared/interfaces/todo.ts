import { PrioritiesEnum } from '../enums/priorities';

export interface Todo {
  id: string;
  description: string;
  dueDate: Date | null;
  creationDate: Date;
  completed: boolean;
  priority: PrioritiesEnum
  completionDate: Date | null;
}

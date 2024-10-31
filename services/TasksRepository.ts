import { Task, TaskId } from "../entities/Task.ts";

export interface TasksRepository {
  getById(taskId: TaskId): Promise<Task | undefined>;

  getAll(): Promise<Task[]>;

  add(task: Task): Promise<void>;

  delete(task: TaskId): Promise<void>;

  update(task: Task): Promise<void>;
}

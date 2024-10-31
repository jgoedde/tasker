import { Task, TaskId } from "./Task.ts";
import { Maybe } from "purify-ts/Maybe";

export interface TasksRepository {
  getById(taskId: TaskId): Promise<Maybe<Task>>;

  getAll(): Promise<Task[]>;

  add(task: Task): Promise<void>;

  delete(task: TaskId): Promise<void>;

  update(task: Task): Promise<void>;
}

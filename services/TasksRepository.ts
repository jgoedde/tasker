import { Task, TaskId } from "../entities/Task.ts";

export interface TasksRepository {
  getById(taskId: TaskId): Promise<Task | undefined>;

  /**
   * Gets a list of tasks.
   *
   * @param fuzzyQuery - If provided, only tasks that match the query are returned. If not, all tasks are returned.
   */
  find(fuzzyQuery?: string): Promise<Task[]>;

  add(task: Task): Promise<void>;

  delete(task: TaskId): Promise<void>;

  update(task: Task): Promise<void>;
}

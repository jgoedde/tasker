import { Task } from "../entities/Task.ts";

export interface TasksRepository {
    getById(taskId: string): Promise<Task | undefined>;

    /**
     * Gets a list of tasks.
     *
     * @param fuzzyQuery - If provided, only tasks that match the query are returned. If not, all tasks are returned.
     */
    find(fuzzyQuery?: string): Promise<Task[]>;

    add(task: Task): Promise<void>;

    delete(task: string): Promise<void>;

    update(task: Task): Promise<void>;
}

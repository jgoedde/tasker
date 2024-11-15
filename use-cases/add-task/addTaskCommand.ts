import { TaskPriority } from "../../entities/Task.ts";

export class AddTaskCommand {
    /**
     * Defines the command to add a new task.
     *
     * @param task The task.
     * @param priority The priority of the task.
     * @param dueDate An optional due date for the task.
     */
    constructor(
        public readonly task: string,
        public readonly priority: TaskPriority,
        public readonly dueDate?: Date,
    ) {
    }
}

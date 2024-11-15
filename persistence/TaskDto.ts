import { Task, TaskPriority } from "../entities/Task.ts";

export class TaskDTO {
    // deno-lint-ignore no-explicit-any
    public static toJSON(task: Task): Record<string, any> {
        return {
            id: task.id,
            name: task.name,
            dueDate: task.dueDate?.toISOString(),
            doneAt: task.doneAt?.toISOString(),
            createdAt: task.createdAt.toISOString(),
            lastModifiedAt: task.lastModifiedAt?.toISOString(),
            priority: task.priority,
        };
    }

    // deno-lint-ignore no-explicit-any
    public static fromJSON(data: Record<string, any>): Task {
        return new Task(
            data.id,
            data.name,
            new Date(data.createdAt),
            data.priority as TaskPriority,
            data.doneAt ? new Date(data.doneAt) : undefined,
            data.dueDate ? new Date(data.dueDate) : undefined,
            data.lastModifiedAt ? new Date(data.lastModifiedAt) : undefined,
        );
    }
}

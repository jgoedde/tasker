import { TaskPriority } from "../../entities/Task.ts";

export class AddTaskCommand {
  constructor(
    public readonly task: string,
    public readonly priority: TaskPriority,
    public readonly dueDate?: Date,
  ) {
  }
}

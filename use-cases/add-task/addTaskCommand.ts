import { TaskPriority } from "../../entities/Task.ts";

export class AddTaskCommand {
  constructor(
    public readonly task: string,
    public readonly dueDate?: Date,
    public readonly priority?: TaskPriority,
  ) {
  }
}

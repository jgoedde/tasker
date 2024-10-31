import { TaskPriority } from "../../Task.ts";

export class AddTaskCommand {
  constructor(
    public readonly task: string,
    public readonly dueDate?: Date,
    public readonly priority?: TaskPriority,
  ) {
  }
}

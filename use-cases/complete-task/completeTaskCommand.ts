import { TaskId } from "../../entities/Task.ts";

export class CompleteTaskCommand {
  constructor(public readonly taskId: TaskId) {
  }
}

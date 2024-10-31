import { TaskId } from "../../Task.ts";

export class CompleteTaskCommand {
  constructor(public readonly taskId: TaskId) {
  }
}

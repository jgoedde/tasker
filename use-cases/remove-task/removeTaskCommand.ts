import { TaskId } from "../../Task.ts";

export class RemoveTaskCommand {
  constructor(public readonly taskId: TaskId) {
  }
}

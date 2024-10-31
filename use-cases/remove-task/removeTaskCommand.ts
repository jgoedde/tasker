import { TaskId } from "../../entities/Task.ts";

export class RemoveTaskCommand {
  constructor(public readonly taskId: TaskId) {
  }
}

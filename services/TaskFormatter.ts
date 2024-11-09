import { injectable } from "inversify";
import { Task } from "../entities/Task.ts";

@injectable()
export class TaskFormatter {
  public formatTask(task: Task): string {
    return `Prio ${task.priority} ${task.id} - "${task.name}" (${
      task.doneAt == null ? "not done" : "done"
    }), created at ${task.createdAt}`;
  }
}

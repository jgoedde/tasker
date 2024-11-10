import { injectable } from "inversify";
import { Task, TaskPriority } from "../entities/Task.ts";
import { formatDistance } from "date-fns";

/**
 * Formats a task for console printing.
 * @TODO - make use of cliffy deno package to display it prettily with colors.
 */
@injectable()
export class TaskFormatter {
  public formatTask(task: Task): string {
    let str = "";
    if (task.doneAt != null) {
      str += "[Done] ";
    }

    str += task.name;

    const formattedPrio = this.getPriority(task.priority);

    if (formattedPrio != null) {
      str += ", " + formattedPrio + " priority";
    }

    if (task.dueDate != null) {
      str += `, due ${
        formatDistance(task.dueDate, new Date(), { addSuffix: true })
      }`;
    }

    return str;
  }

  private getPriority(priority: TaskPriority): string | undefined {
    switch (priority) {
      case TaskPriority.LOW:
        return "Low";
      case TaskPriority.STANDARD:
        return undefined;
      case TaskPriority.HIGH:
        return "High";
      case TaskPriority.HIGHEST:
        return "Highest";
    }
  }
}

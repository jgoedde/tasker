import { injectable } from "inversify";
import { Task, TaskPriority } from "../entities/Task.ts";
import { formatDistance, isPast } from "date-fns";
import { colors } from "@cliffy/ansi/colors";

/**
 * Formats a task for console printing.
 */
@injectable()
export class TaskFormatter {
    public formatTask(task: Task): string {
        let str = "";
        if (task.isCompleted()) {
            str += colors.green("[Done] ");
        }

        str += task.name;

        const formattedPriority = this.getPriority(task.priority);

        if (formattedPriority != null) {
            str += `${colors.reset(", ") + formattedPriority}`;
        }

        if (task.dueDate != null) {
            str += ", ";
            if (isPast(task.dueDate) && !task.isCompleted()) {
                str += colors.red(
                    `due ${
                        formatDistance(task.dueDate, new Date(), {
                            addSuffix: true,
                        })
                    }`,
                );
            } else {
                str += colors.reset(
                    `due ${
                        formatDistance(task.dueDate, new Date(), {
                            addSuffix: true,
                        })
                    }`,
                );
            }
        }

        str += colors.gray(` (${task.id})`);

        return str;
    }

    private getPriority(priority: TaskPriority): string | undefined {
        switch (priority) {
            case TaskPriority.LOW:
                return colors.gray("Low priority");
            case TaskPriority.STANDARD:
                return undefined;
            case TaskPriority.HIGH:
                return colors.brightYellow("High priority");
            case TaskPriority.HIGHEST:
                return colors.brightRed("Highest priority");
        }
    }
}

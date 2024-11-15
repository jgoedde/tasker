import { TaskPriority } from "../../entities/Task.ts";
import { container } from "../../dependency-injection/bind.inversify.ts";
import { AddTaskCommandHandler } from "../../use-cases/add-task/addTaskCommandHandler.ts";
import { AddTaskCommand } from "../../use-cases/add-task/addTaskCommand.ts";
import { Command, ValidationError } from "@cliffy/command";
import { z } from "zod";
import * as chrono from "chrono-node";
import { isPast } from "date-fns";
import { Confirm } from "@cliffy/prompt/confirm";
import { prompt } from "@cliffy/prompt";

export function createAddTaskCommand() {
    return new Command()
        .arguments("<task...:string>")
        .example(
            `tasker add -d "in 1 month" -p Low Call Jaden`,
            "Adds a new todo to call Jaden with a deadline of now + 1 month. The priority is low.",
        )
        .option(
            "-d, --due <date:string>",
            "The date the task is due. Example: tomorrow, in a week",
            {
                required: false,
                value: dueDateOptionTransformer,
            },
        )
        .option(
            "-p, --priority <prio>",
            `The priority of the task. Possible values are ${
                Object.values(TaskPriority).join(", ")
            } (default: Standard)`,
            {
                required: false,
                default: TaskPriority.STANDARD,
                value: priorityOptionTransformer,
            },
        )
        .description("Add a new task")
        .action(handleAction);
}

function priorityOptionTransformer(
    value: string,
) {
    const priority = z.nativeEnum(TaskPriority).safeParse(value);
    if (!priority.success) {
        throw new ValidationError(
            `Invalid priority. Possible values are ${
                Object.values(TaskPriority).join(", ")
            }`,
        );
    }
    return priority.data;
}

async function handleAction(
    options: { due?: Date; priority?: TaskPriority },
    ...task: string[]
) {
    const dueDate = options.due;

    if (dueDate != null && isPast(dueDate)) {
        const result = await prompt([{
            name: "shouldIgnorePastDueDate",
            message:
                "The due date is in the past. Are you sure you want to continue?",
            type: Confirm,
            hideDefault: false,
            default: false,
        }]);

        if (!result.shouldIgnorePastDueDate) {
            console.info("Did not proceed to add task.");
            return;
        }
    }

    const handler: AddTaskCommandHandler = container.resolve(
        AddTaskCommandHandler,
    );

    handler.handle(
        new AddTaskCommand(
            task.join(" "),
            options.priority ?? TaskPriority.STANDARD,
            dueDate,
        ),
    );
}

function dueDateOptionTransformer(dateStr: string): Date | null {
    const parsedDate = chrono.parseDate(dateStr);
    if (parsedDate == null) {
        throw new ValidationError(
            "Unable to parse your date, please try something else.",
        );
    }

    return parsedDate;
}

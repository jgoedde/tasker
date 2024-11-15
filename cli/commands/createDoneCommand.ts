import { container } from "../../dependency-injection/bind.inversify.ts";
import { CompleteTaskCommandHandler } from "../../use-cases/complete-task/completeTaskCommandHandler.ts";
import { CompleteTaskCommand } from "../../use-cases/complete-task/completeTaskCommand.ts";
import { Command } from "@cliffy/command";
import { ofClass } from "../../utils/utils.ts";
import {
    AmbiguousTaskQueryError,
    TaskAlreadyCompletedError,
    TaskNotFoundError,
} from "../../entities/Task.ts";
import { colors } from "@cliffy/ansi/colors";
import { Checkbox } from "@cliffy/prompt/checkbox";
import { TaskFormatter } from "../../services/TaskFormatter.ts";

export function createDoneCommand() {
    return new Command()
        .arguments("<task...:string>")
        .description(
            "Mark a task as done. You can either specify the task ID or a fuzzy term. If there are multiple tasks found with your term, you will see the ambiguous ones.",
        )
        .example(
            `tasker done call jaden`,
            "Marks a task matching the provided term (call jaden) as done.",
        )
        .action(onAction);
}

function onAction(_: unknown, ...id: string[]) {
    const handler: CompleteTaskCommandHandler = container.resolve(
        CompleteTaskCommandHandler,
    );

    handler.handle(
        new CompleteTaskCommand(id.join(" ")),
    )
        .then((task) => {
            console.log(colors.brightGreen(`Hurray, task ${task.name} done!`));
        })
        .catch(ofClass(TaskAlreadyCompletedError, (_) => {
            console.info(
                "This task is already done. Try a different search term or specify an ID.",
            );
        }))
        .catch(ofClass(TaskNotFoundError, (_) => {
            console.error(
                "There is no task matching your provided search term. Try a different search term or specify an ID.",
            );
        }))
        .catch(ofClass(AmbiguousTaskQueryError, async (e) => {
            const taskFormatter: TaskFormatter = container.resolve(
                TaskFormatter,
            );
            console.error(
                colors.brightRed(
                    "More than one task that matches your task identifier was found:",
                ),
            );

            // The ID of the task to be deleted
            const taskId: string | undefined = (await Checkbox.prompt({
                message: "What tasks would you like to remove?",
                maxOptions: 1,
                confirmSubmit: true,
                options: e.tasks.map((task) => ({
                    name: taskFormatter.formatTask(task),
                    value: task.id,
                })),
            }))?.[0];

            if (taskId != null) {
                void handler.handle(new CompleteTaskCommand(taskId));
            }
        }));
}

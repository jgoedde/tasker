import { container } from "../../dependency-injection/bind.inversify.ts";
import { RemoveTaskCommandHandler } from "../../use-cases/remove-task/removeTaskCommandHandler.ts";
import { RemoveTaskCommand } from "../../use-cases/remove-task/removeTaskCommand.ts";
import { Command } from "@cliffy/command";
import {
    AmbiguousTaskQueryError,
    TaskNotFoundError,
} from "../../entities/Task.ts";
import { TaskFormatter } from "../../services/TaskFormatter.ts";
import { ofClass } from "../../utils/utils.ts";
import { Checkbox } from "@cliffy/prompt";
import { colors } from "@cliffy/ansi/colors";

export function createRemoveCommand() {
    return new Command()
        .arguments("<task...:string>")
        .example(
            "tasker remove go shopping",
            `Removes the task "go shopping" if present. If there are multiple tasks matching, none will be removed.`,
        )
        .description("Remove a task")
        .action((_: never, ...args: string[]) => onAction(args.join(" ")));
}

function onAction(id: string) {
    const handler: RemoveTaskCommandHandler = container.resolve(
        RemoveTaskCommandHandler,
    );
    const taskFormatter = container.resolve(TaskFormatter);
    const command = new RemoveTaskCommand(id);

    void handler.handle(command)
        .then(() => {
            console.info(
                colors.brightGreen("The task was successfully removed."),
            );
        })
        .catch(ofClass(TaskNotFoundError, (_) => {
            console.error(
                colors.brightRed(
                    `There was no task matching your task identifier "${command.task}"`,
                ),
            );
        }))
        .catch(ofClass(AmbiguousTaskQueryError, async (e) => {
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

            void handler.handle(new RemoveTaskCommand(taskId)); // Should never throw
        }));
}

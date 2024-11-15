import { Command } from "@cliffy/command";
import { container } from "../../dependency-injection/bind.inversify.ts";
import { GetTasksQueryHandler } from "../../use-cases/get-all-tasks/getTasksQueryHandler.ts";
import { GetTasksQuery } from "../../use-cases/get-all-tasks/getTasksQuery.ts";
import z from "zod";
import { colors } from "@cliffy/ansi/colors";
import { TaskFormatter } from "../../services/TaskFormatter.ts";

export function createGetTasksCommand() {
    return new Command()
        .description("List all tasks")
        .example(
            `tasker list`,
            "Lists all of your open tasks.",
        )
        .example(
            `tasker list -f "study"`,
            `Lists all of your open tasks matching the word "study"`,
        )
        .example(
            `tasker list -f "study" -d`,
            `Lists all of your tasks matching the word "study" including the ones that are completed already.`,
        )
        .option(
            "-f, --filter <search:string>",
            "A search term for filtering your tasks.",
            {
                required: false,
            },
        )
        .option(
            "-d, --include-done",
            "Already completed tasks are included in the output",
            { required: false, default: false },
        )
        .action(
            onAction,
        );
}

async function onAction(
    { filter, includeDone }: { filter?: string; includeDone: boolean },
) {
    const query = z.string().safeParse(filter);
    const taskFormatter: TaskFormatter = container.resolve(TaskFormatter);
    const handler: GetTasksQueryHandler = container.resolve(
        GetTasksQueryHandler,
    );
    const tasks = await handler.handle(
        new GetTasksQuery(includeDone, query.data ?? undefined),
    );

    if (tasks.length === 0) {
        console.info(colors.gray("There is nothing to do right now."));
    }

    tasks.forEach((task, idx) => {
        console.log(`${idx + 1}. ${taskFormatter.formatTask(task)}`);
    });
}

import { Command } from "@cliffy/command";
import { container } from "../../dependency-injection/bind.inversify.ts";
import { GetTasksQueryHandler } from "../../use-cases/get-all-tasks/getTasksQueryHandler.ts";
import { GetTasksQuery } from "../../use-cases/get-all-tasks/getTasksQuery.ts";
import z from "zod";

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

function onAction(
    { filter, includeDone }: { filter?: string; includeDone: boolean },
) {
    const query = z.string().safeParse(filter);
    const handler: GetTasksQueryHandler = container.resolve(
        GetTasksQueryHandler,
    );
    void handler.handle(
        new GetTasksQuery(includeDone, query.data ?? undefined),
    );
}

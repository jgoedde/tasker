import { Command } from "@cliffy/command";
import { createAddTaskCommand } from "./commands/createAddTaskCommand.ts";
import { createGetTasksCommand } from "./commands/createGetTasksCommand.ts";
import { createPruneDbCommand } from "./commands/createPruneDbCommand.ts";
import { createDoneCommand } from "./commands/createDoneCommand.ts";
import { createRemoveCommand } from "./commands/createRemoveCommand.ts";

export function registerCommands(program: Command) {
    return program
        .command("add", createAddTaskCommand())
        .command("list", createGetTasksCommand())
        .command("prune", createPruneDbCommand())
        .command("done", createDoneCommand())
        .command("remove", createRemoveCommand());
}

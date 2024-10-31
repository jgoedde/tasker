import "reflect-metadata";
import { Command } from "commander";
import { container, installDependencies } from "./dependencyInjection.ts";
import { GetTasksQueryHandler } from "./use-cases/get-all-tasks/getTasksQueryHandler.ts";
import { AddTaskCommand } from "./use-cases/add-task/addTaskCommand.ts";
import { AddTaskCommandHandler } from "./use-cases/add-task/addTaskCommandHandler.ts";
import { CompleteTaskCommand } from "./use-cases/complete-task/completeTaskCommand.ts";
import { CompleteTaskCommandHandler } from "./use-cases/complete-task/completeTaskCommandHandler.ts";
import promptly from "promptly";
import { PathProvider } from "./PathProvider.ts";
import { GetTasksQuery } from "./use-cases/get-all-tasks/getTasksQuery.ts";
import {RemoveTaskCommandHandler} from "./use-cases/remove-task/removeTaskCommandHandler.ts";
import {RemoveTaskCommand} from "./use-cases/remove-task/removeTaskCommand.ts";

installDependencies();

const program = new Command();

program
  .name("tasker")
  .description("A simple task management CLI")
  .version("1.0.0");

program
  .command("add")
  .description("Add a new task")
  .argument('<task>', "Task description")
  .option("--due <date>", "Due date for the task")
  .action((task, options) => {
    const handler = container.resolve(AddTaskCommandHandler);

    void handler.handle(new AddTaskCommand(task, options?.dueDate));
  });

program
  .command("list")
  .description("List all tasks")
  .option(
    "--include-done",
    "Already completed tasks are included in the output",
  )
  .action((options) => {
    void container.resolve(GetTasksQueryHandler).handle(
      new GetTasksQuery(options.includeDone ?? false),
    );
  });

// Done command
program
  .command("done")
  .description("Mark a task as done")
  .argument("<id>", "ID of the task to mark as done")
  .action((id) => {
    container.resolve(CompleteTaskCommandHandler).handle(
      new CompleteTaskCommand(id),
    );
  });

program
  .command("remove")
  .description("Remove a task")
  .argument("<id>", "ID of the task to remove")
  .action((id) => {
      void container.resolve(RemoveTaskCommandHandler).handle(new RemoveTaskCommand(id))
  });

program
  .command("prune")
  .description("Clear local database")
  .action(async () => {
    const newVar: boolean = await promptly.confirm(
      "Are you sure you want to clear all tasks? [y/N]",
      { default: "n" },
    );
    if (newVar) {
      await Deno.remove(container.resolve(PathProvider).getAppDirectory(), {
        recursive: true,
      });
      console.log("removed everything!");
    }
  });

program.parse();

import "reflect-metadata";
import { Command } from "commander";
import { container, installDependencies } from "./dependencyInjection.ts";
import { QueryTasksHandler } from "./use-cases/get-all-tasks/queryTasksHandler.ts";
import { AddTaskCommand } from "./use-cases/add-task/addTaskCommand.ts";
import { AddTaskCommandHandler } from "./use-cases/add-task/addTaskCommandHandler.ts";
import { CompleteTaskCommand } from "./use-cases/complete-task/completeTaskCommand.ts";
import { CompleteTaskCommandHandler } from "./use-cases/complete-task/completeTaskCommandHandler.ts";
import promptly from "promptly";
import { PathProvider } from "./PathProvider.ts";

installDependencies();

const program = new Command();

program
  .name("tasker")
  .description("A simple task management CLI")
  .version("1.0.0");

program
  .command("add")
  .description("Add a new task")
  .argument('"<task>"', "Task description")
  .option("--due <date>", "Due date for the task")
  .action((task, options) => {
    const handler = container.resolve(AddTaskCommandHandler);

    void handler.handle(new AddTaskCommand(task, options?.dueDate));
  });

program
  .command("list")
  .description("List all tasks")
  .action(() => {
    void container.resolve(QueryTasksHandler).handle();
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
    console.log("removed: " + id);
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

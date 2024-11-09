import { TYPES } from "../../dependency-injection/types.inversify.ts";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { inject, injectable } from "inversify";
import { DateProvider } from "../../services/DateProvider.ts";
import { CompleteTaskCommand } from "./completeTaskCommand.ts";
import { TaskFormatter } from "../../services/TaskFormatter.ts";

@injectable()
export class CompleteTaskCommandHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
    @inject(TYPES.DateProvider) private readonly dateProvider: DateProvider,
    @inject(TYPES.TaskFormatter) private readonly taskFormatter: TaskFormatter,
  ) {
  }

  public async handle(command: CompleteTaskCommand) {
    const tasks = await this.tasksRepository.find(command.id);

    if (tasks.length === 0) {
      console.error("There is no task matching your arguments.");
      return;
    }

    if (tasks.length > 1) {
      console.warn(
        `Ambiguous task identifier. Found ${tasks.length} tasks matching your input:`,
      );
      tasks.forEach((task) => console.log(this.taskFormatter.formatTask(task)));
      return;
    }

    const task = tasks[0];

    task.complete(this.dateProvider.now());

    await this.tasksRepository.update(task);

    console.info("Hurray! Task done.");
  }
}

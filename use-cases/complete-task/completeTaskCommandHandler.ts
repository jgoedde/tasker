import { TYPES } from "../../dependency-injection/types.inversify.ts";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { inject, injectable } from "inversify";
import { DateProvider } from "../../services/DateProvider.ts";
import { CompleteTaskCommand } from "./completeTaskCommand.ts";

@injectable()
export class CompleteTaskCommandHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
    @inject(TYPES.DateProvider) private readonly dateProvider: DateProvider,
  ) {
  }

  public async handle(command: CompleteTaskCommand) {
    const task = await this.tasksRepository.getById(command.taskId);
    if (task) {
      task.complete(this.dateProvider.now());

      await this.tasksRepository.update(task);

      console.info("Hurray! Task done.");
    } else {
      console.error("There is no such task with id " + command.taskId);
    }
  }
}

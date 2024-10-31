import { TYPES } from "../../types.inversify.ts";
import type { TasksRepository } from "../../TasksRepository.ts";
import { inject, injectable } from "inversify";
import { DateProvider } from "../../DateProvider.ts";
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
    (await this.tasksRepository.getById(command.taskId))
      .ifJust(async (task) => {
        task.complete(this.dateProvider.now());

        await this.tasksRepository.update(task);
      })
      .ifNothing(() => {
        console.error("There is no such task with id " + command.taskId);
      });
  }
}

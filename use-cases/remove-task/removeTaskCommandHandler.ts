import { TYPES } from "../../dependency-injection/types.inversify.ts";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { inject, injectable } from "inversify";
import { DateProvider } from "../../services/DateProvider.ts";
import { RemoveTaskCommand } from "./removeTaskCommand.ts";

@injectable()
export class RemoveTaskCommandHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
    @inject(TYPES.DateProvider) private readonly dateProvider: DateProvider,
  ) {
  }

  public async handle(command: RemoveTaskCommand) {
    await this.tasksRepository.delete(command.taskId);
  }
}

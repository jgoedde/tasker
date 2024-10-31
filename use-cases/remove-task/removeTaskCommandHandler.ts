import { TYPES } from "../../types.inversify.ts";
import type { TasksRepository } from "../../TasksRepository.ts";
import { inject, injectable } from "inversify";
import { DateProvider } from "../../DateProvider.ts";
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

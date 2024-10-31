import { inject, injectable } from "inversify";
import type { TasksRepository } from "../../TasksRepository.ts";
import { TYPES } from "../../types.inversify.ts";

@injectable()
export class QueryTasksHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
  ) {
  }

  public async handle() {
    const all = await this.tasksRepository.getAll();
    console.log(all, "all");
  }
}

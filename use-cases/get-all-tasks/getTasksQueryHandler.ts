import { inject, injectable } from "inversify";
import type { TasksRepository } from "../../TasksRepository.ts";
import { TYPES } from "../../types.inversify.ts";
import { GetTasksQuery } from "./getTasksQuery.ts";
import { TaskSorter } from "../../TaskSorter.ts";

@injectable()
export class GetTasksQueryHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
  ) {
  }

  public async handle(query: GetTasksQuery) {
    const all = await this.tasksRepository.getAll();

    const tasksSorted = TaskSorter.sort(all, query.includeDone);

    tasksSorted.forEach((task) => {
      console.log(
        `Prio ${task.priority} ${task.id} - "${task.name}" (${
          task.doneAt == null ? "not done" : "done"
        }), created at ${task.createdAt}`,
      );
    });
  }
}

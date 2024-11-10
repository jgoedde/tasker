import { inject, injectable } from "inversify";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { TYPES } from "../../dependency-injection/types.inversify.ts";
import { GetTasksQuery } from "./getTasksQuery.ts";
import { TaskSorter } from "../../services/TaskSorter.ts";
import { TaskFormatter } from "../../services/TaskFormatter.ts";

@injectable()
export class GetTasksQueryHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
    @inject(TYPES.TaskFormatter) private readonly taskFormatter: TaskFormatter,
  ) {
  }

  public async handle(query: GetTasksQuery) {
    const all = await this.tasksRepository.find(query.query);

    const tasksSorted = TaskSorter.sort(all, query.includeDone);

    if (tasksSorted.length === 0) {
      console.log("There are no tasks to do.");
      return;
    }

    tasksSorted.forEach((task, index) => {
      console.log(`${index + 1}. ${this.taskFormatter.formatTask(task)}`);
    });
  }
}

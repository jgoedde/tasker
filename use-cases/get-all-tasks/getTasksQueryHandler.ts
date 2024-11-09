import { inject, injectable } from "inversify";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { TYPES } from "../../dependency-injection/types.inversify.ts";
import { GetTasksQuery } from "./getTasksQuery.ts";
import { TaskSorter } from "../../services/TaskSorter.ts";
import { Task } from "../../entities/Task.ts";

@injectable()
export class GetTasksQueryHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
  ) {
  }

  public async handle(query: GetTasksQuery) {
    const all = await this.tasksRepository.getAll(query.query);

    const tasksSorted = TaskSorter.sort(all, query.includeDone);

    if (tasksSorted.length === 0) {
      console.log("There are no tasks to do.");
      return;
    }

    tasksSorted.forEach((task) => {
      console.log(this.formatTask(task));
    });
  }

  private formatTask(task: Task) {
    return `Prio ${task.priority} ${task.id} - "${task.name}" (${
      task.doneAt == null ? "not done" : "done"
    }), created at ${task.createdAt}`;
  }
}

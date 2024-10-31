import { inject, injectable } from "inversify";
import type { TasksRepository } from "../../TasksRepository.ts";
import { TYPES } from "../../types.inversify.ts";
import { GetTasksQuery } from "./getTasksQuery.ts";

@injectable()
export class GetTasksQueryHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
  ) {
  }

  public async handle(query: GetTasksQuery) {
    const all = await this.tasksRepository.getAll();

    const foo = all.filter((task) =>
      query.includeDone ? true : task.doneAt == null
    ).toSorted((a, b) => {
      if (a.dueDate != null && b.dueDate != null) {
        return b.dueDate.getTime() - a.dueDate.getTime();
      }

      return 0;
    });

    foo.forEach((task) => {
      console.log(
        `Prio ${task.priority} ${task.id} - "${task.name}" (${
          task.doneAt == null ? "not done" : "done"
        }), created at ${task.createdAt}`,
      );
    });
  }
}

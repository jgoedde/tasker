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

    public async handle(query: GetTasksQuery): Promise<Task[]> {
        const all = await this.tasksRepository.find(query.query);

        return TaskSorter.sort(all, query.includeDone);
    }
}

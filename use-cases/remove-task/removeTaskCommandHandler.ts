import { TYPES } from "../../dependency-injection/types.inversify.ts";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { inject, injectable } from "inversify";
import { RemoveTaskCommand } from "./removeTaskCommand.ts";
import {
    AmbiguousTaskQueryError,
    TaskNotFoundError,
} from "../../entities/Task.ts";

@injectable()
export class RemoveTaskCommandHandler {
    public constructor(
        @inject(TYPES.TasksRepository) private readonly tasksRepository:
            TasksRepository,
    ) {
    }

    /**
     * Removes a task.
     *
     * @throws TaskNotFoundError when no task can be found with the provided search term.
     * @throws AmbiguousTaskQueryError when there were more than one task found for the provided search term.
     */
    public async handle(command: RemoveTaskCommand): Promise<void> {
        const tasks = await this.tasksRepository.find(command.task);

        if (tasks.length === 0) {
            throw new TaskNotFoundError();
        }

        if (tasks.length > 1) {
            throw new AmbiguousTaskQueryError(tasks);
        }

        await this.tasksRepository.delete(tasks[0].id);
    }
}

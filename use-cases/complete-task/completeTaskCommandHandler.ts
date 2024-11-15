import { TYPES } from "../../dependency-injection/types.inversify.ts";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { inject, injectable } from "inversify";
import { DateProvider } from "../../services/DateProvider.ts";
import { CompleteTaskCommand } from "./completeTaskCommand.ts";
import {
    AmbiguousTaskQueryError,
    TaskNotFoundError,
} from "../../entities/Task.ts";

@injectable()
export class CompleteTaskCommandHandler {
    public constructor(
        @inject(TYPES.TasksRepository) private readonly tasksRepository:
            TasksRepository,
        @inject(TYPES.DateProvider) private readonly dateProvider: DateProvider,
    ) {
    }

    /**
     * Marks a task as completed.
     *
     * @throws TaskNotFoundError
     * @throws AmbiguousTaskQueryError
     * @throws TaskAlreadyCompletedError
     */
    public async handle(command: CompleteTaskCommand) {
        const tasks = await this.tasksRepository.find(command.task);

        if (tasks.length === 0) {
            throw new TaskNotFoundError();
        }

        if (tasks.length > 1) {
            throw new AmbiguousTaskQueryError(tasks);
        }

        const task = tasks[0];

        task.complete(this.dateProvider.now());

        void this.tasksRepository.update(task);
    }
}

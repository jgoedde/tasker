import { TYPES } from "../../dependency-injection/types.inversify.ts";
import type { TasksRepository } from "../../services/TasksRepository.ts";
import { AddTaskCommand } from "./addTaskCommand.ts";
import { inject, injectable } from "inversify";
import { nanoid } from "nanoid";
import { DateProvider } from "../../services/DateProvider.ts";
import { Task } from "../../entities/Task.ts";

@injectable()
export class AddTaskCommandHandler {
  public constructor(
    @inject(TYPES.TasksRepository) private readonly tasksRepository:
      TasksRepository,
    @inject(TYPES.DateProvider) private readonly dateProvider: DateProvider,
  ) {
  }

  public async handle(command: AddTaskCommand) {
    const newTask = Task.create(
      nanoid(10),
      command.task,
      this.dateProvider.now(),
      command.priority,
      command.dueDate,
    );
    await this.tasksRepository.add(newTask);
    console.log(
      `Added new ${command.priority} priority task "${command.task}" (${newTask.id})`,
    );
  }
}

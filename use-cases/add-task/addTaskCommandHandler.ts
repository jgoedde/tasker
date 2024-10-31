import { TYPES } from "../../types.inversify.ts";
import type { TasksRepository } from "../../TasksRepository.ts";
import { AddTaskCommand } from "./addTaskCommand.ts";
import { inject, injectable } from "inversify";
import { nanoid } from "nanoid";
import { DateProvider } from "../../DateProvider.ts";
import { Task } from "../../Task.ts";

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
      command.dueDate,
    );
    await this.tasksRepository.add(newTask);
    console.log(`Added new task "${command.task}" (${newTask.id})`);
  }
}

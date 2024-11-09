import { Container } from "inversify";
import { TasksRepository } from "../services/TasksRepository.ts";
import { TasksFileSystemRepository } from "../persistence/TasksFileSystemRepository.ts";
import { GetTasksQueryHandler } from "../use-cases/get-all-tasks/getTasksQueryHandler.ts";
import { TYPES } from "./types.inversify.ts";
import { PathProvider } from "../services/PathProvider.ts";
import { AddTaskCommandHandler } from "../use-cases/add-task/addTaskCommandHandler.ts";
import { DateProvider } from "../services/DateProvider.ts";
import { RemoveTaskCommandHandler } from "../use-cases/remove-task/removeTaskCommandHandler.ts";
import { TaskFormatter } from "../services/TaskFormatter.ts";

export const container = new Container();

export function installDependencies() {
  container.bind<TasksRepository>(TYPES.TasksRepository).to(
    TasksFileSystemRepository,
  );
  container.bind<GetTasksQueryHandler>(TYPES.QueryTasksHandler).to(
    GetTasksQueryHandler,
  )
    .inTransientScope();
  container.bind<AddTaskCommandHandler>(TYPES.AddTaskCommandHandler).to(
    AddTaskCommandHandler,
  )
    .inTransientScope();
  container.bind<RemoveTaskCommandHandler>(TYPES.RemoveTaskCommandHandler).to(
    RemoveTaskCommandHandler,
  )
    .inTransientScope();
  container.bind<PathProvider>(TYPES.PathProvider).to(PathProvider)
    .inSingletonScope();
  container.bind<DateProvider>(TYPES.DateProvider).to(DateProvider)
    .inTransientScope();
  container.bind<TaskFormatter>(TYPES.TaskFormatter).to(TaskFormatter)
    .inTransientScope();
}

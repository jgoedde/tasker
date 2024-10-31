import { Container } from "inversify";
import { TasksRepository } from "./TasksRepository.ts";
import { TasksFileSystemRepository } from "./TasksFileSystemRepository.ts";
import { GetTasksQueryHandler } from "./use-cases/get-all-tasks/getTasksQueryHandler.ts";
import { TYPES } from "./types.inversify.ts";
import { PathProvider } from "./PathProvider.ts";
import { AddTaskCommandHandler } from "./use-cases/add-task/addTaskCommandHandler.ts";
import { DateProvider } from "./DateProvider.ts";
import { RemoveTaskCommandHandler } from "./use-cases/remove-task/removeTaskCommandHandler.ts";

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
}

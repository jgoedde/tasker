import { Container } from "inversify";
import { TasksRepository } from "./TasksRepository.ts";
import { TasksFileSystemRepository } from "./TasksFileSystemRepository.ts";
import { QueryTasksHandler } from "./use-cases/get-all-tasks/queryTasksHandler.ts";
import { TYPES } from "./types.inversify.ts";
import { PathProvider } from "./PathProvider.ts";

import { AddTaskCommandHandler } from "./use-cases/add-task/addTaskCommandHandler.ts";
import { DateProvider } from "./DateProvider.ts";

export const container = new Container();

export function installDependencies() {
  container.bind<TasksRepository>(TYPES.TasksRepository).to(
    TasksFileSystemRepository,
  );
  container.bind<QueryTasksHandler>(TYPES.QueryTasksHandler).to(
    QueryTasksHandler,
  )
    .inTransientScope();
  container.bind<AddTaskCommandHandler>(TYPES.AddTaskCommandHandler).to(
    AddTaskCommandHandler,
  )
    .inTransientScope();
  container.bind<PathProvider>(TYPES.PathProvider).to(PathProvider)
    .inSingletonScope();
  container.bind<DateProvider>(TYPES.DateProvider).to(DateProvider)
    .inTransientScope();
}

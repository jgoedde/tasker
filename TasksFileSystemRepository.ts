import { TasksRepository } from "./TasksRepository.ts";
import { Task, TaskId } from "./Task.ts";
import { inject, injectable } from "inversify";
import { PathProvider } from "./PathProvider.ts";
import { TYPES } from "./types.inversify.ts";
import { Maybe } from "purify-ts/Maybe";

@injectable()
export class TasksFileSystemRepository implements TasksRepository {
  constructor(
    @inject(TYPES.PathProvider) private readonly pathProvider: PathProvider,
  ) {
  }
  async getById(taskId: TaskId): Promise<Maybe<Task>> {
    await this.prepareTasksFile();

    const tasks = await this.getAll();

    return Maybe.fromNullable(tasks.find((task) => task.id === taskId));
  }

  async add(task: Task): Promise<void> {
    await this.prepareTasksFile();

    const tasks = await this.getAll();

    const textEncoder = new TextEncoder();

    const uint8Array = textEncoder.encode(JSON.stringify([...tasks, task]));

    await Deno.writeFile(this.pathProvider.getTasksFile(), uint8Array);
  }

  async delete(taskId: TaskId): Promise<void> {
    await this.prepareTasksFile();

    const tasks = await this.getAll();

    const textEncoder = new TextEncoder();
    const newList = tasks.filter((task) => task.id !== taskId);
    const uint8Array = textEncoder.encode(
      JSON.stringify(newList),
    );

    await Deno.writeFile(this.pathProvider.getTasksFile(), uint8Array);
  }

  async getAll(): Promise<Task[]> {
    await this.prepareTasksFile();

    const uint8Array = await Deno.readFile(this.pathProvider.getTasksFile());

    return (JSON.parse(new TextDecoder().decode(uint8Array)) as Array<unknown>)
      .map((t) =>
        new Task(
          t._id,
          t._name,
          t._createdAt,
          t._priority,
          t._doneAt,
          t._dueDate,
          t._lastModifiedAt,
        )
      );
  }

  async update(task: Task): Promise<void> {
    await this.prepareTasksFile();

    const tasks = await this.getAll();

    tasks[tasks.findIndex((t) => t.id === task.id)] = task;

    const textEncoder = new TextEncoder();
    const uint8Array = textEncoder.encode(JSON.stringify(tasks));

    await Deno.writeFile(this.pathProvider.getTasksFile(), uint8Array);
  }

  private async prepareTasksFile() {
    // Ensure the directory exists
    try {
      await Deno.mkdir(this.pathProvider.getAppDirectory(), {
        recursive: true,
      });
    } catch (err) {
      if (!(err instanceof Deno.errors.AlreadyExists)) {
        console.error("Error creating app directory:", err);
      }
    }

    try {
      await Deno.lstat(this.pathProvider.getTasksFile());
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }

      await Deno.writeFile(
        this.pathProvider.getTasksFile(),
        new TextEncoder().encode(JSON.stringify([])),
      );
    }
  }
}

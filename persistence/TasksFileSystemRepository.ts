import { TasksRepository } from "../services/TasksRepository.ts";
import { Task } from "../entities/Task.ts";
import { inject, injectable } from "inversify";
import { PathProvider } from "../services/PathProvider.ts";
import { TYPES } from "../dependency-injection/types.inversify.ts";
import { TaskDTO } from "./TaskDto.ts";
import fuzzy from "fuzzy";

@injectable()
export class TasksFileSystemRepository implements TasksRepository {
    constructor(
        @inject(TYPES.PathProvider) private readonly pathProvider: PathProvider,
    ) {
    }
    async getById(taskId: string): Promise<Task | undefined> {
        await this.prepareTasksFile();

        const tasks = await this.find();

        return tasks.find((task) => task.id === taskId);
    }

    async add(task: Task): Promise<void> {
        await this.prepareTasksFile();

        const tasks = await this.find();

        const textEncoder = new TextEncoder();

        const uint8Array = textEncoder.encode(
            JSON.stringify([...tasks, task].map(TaskDTO.toJSON)),
        );

        await Deno.writeFile(this.pathProvider.getTasksFile(), uint8Array);
    }

    async delete(taskId: string): Promise<void> {
        await this.prepareTasksFile();

        const tasks = await this.find();

        const textEncoder = new TextEncoder();
        const newList = tasks.filter((task) => task.id !== taskId);
        const uint8Array = textEncoder.encode(
            JSON.stringify(newList.map(TaskDTO.toJSON)),
        );

        await Deno.writeFile(this.pathProvider.getTasksFile(), uint8Array);
    }

    async find(fuzzyQuery?: string): Promise<Task[]> {
        await this.prepareTasksFile();

        const stringified = new TextDecoder().decode(
            await Deno.readFile(this.pathProvider.getTasksFile()),
        );

        const tasks = (JSON.parse(stringified) as Array<
            // deno-lint-ignore no-explicit-any
            Record<string, any>
        >)
            .map(TaskDTO.fromJSON);

        if (fuzzyQuery == null) {
            return tasks;
        }

        // noinspection JSUnusedGlobalSymbols
        return fuzzy
            .filter(fuzzyQuery, tasks, {
                extract(input: Task): string {
                    return `${input.id} ${input.name}`;
                },
            })
            .map((it) => it.original);
    }

    async update(task: Task): Promise<void> {
        await this.prepareTasksFile();

        const tasks = await this.find();

        tasks[tasks.findIndex((t) => t.id === task.id)] = task;

        const textEncoder = new TextEncoder();
        const uint8Array = textEncoder.encode(
            JSON.stringify(tasks.map(TaskDTO.toJSON)),
        );

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

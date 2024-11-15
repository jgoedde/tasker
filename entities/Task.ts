export enum TaskPriority {
    LOW = "Low",
    STANDARD = "Standard",
    HIGH = "High",
    HIGHEST = "Highest",
}

export class Task {
    get priority(): TaskPriority {
        return this._priority;
    }

    private readonly _id: string;
    private _name: string;
    private _dueDate?: Date;
    private _doneAt?: Date;
    private readonly _createdAt: Date;
    private _lastModifiedAt?: Date;
    private _priority: TaskPriority;

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get dueDate(): Date | undefined {
        return this._dueDate;
    }

    get doneAt(): Date | undefined {
        return this._doneAt;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get lastModifiedAt(): Date | undefined {
        return this._lastModifiedAt;
    }

    public constructor(
        id: string,
        name: string,
        createdAt: Date,
        priority: TaskPriority,
        doneAt?: Date,
        dueDate?: Date,
        lastModifiedAt?: Date,
    ) {
        this._id = id;
        this._name = name;
        this._dueDate = dueDate;
        this._doneAt = doneAt;
        this._createdAt = createdAt;
        this._lastModifiedAt = lastModifiedAt;
        this._priority = priority;
    }

    /**
     * Completes a task by setting its `doneAt` field to the provided date.
     *
     * @throws TaskAlreadyCompletedError when the task is already marked as done.
     */
    public complete(date: Date) {
        if (this.isCompleted()) {
            throw new TaskAlreadyCompletedError(this.id);
        }
        this._doneAt = date;
    }

    public changeName(name: string) {
        this._name = name;
        this._lastModifiedAt = new Date();
    }

    public setNewDueDate(due: Date) {
        this._dueDate = due;
        this._lastModifiedAt = new Date();
    }

    public updatePriority(priority: TaskPriority) {
        this._priority = priority;
        this._lastModifiedAt = new Date();
    }

    public isCompleted() {
        return this._doneAt != null;
    }

    public static create(
        id: string,
        name: string,
        createdAt: Date,
        priority: TaskPriority = TaskPriority.STANDARD,
        dueDate?: Date,
    ) {
        return new Task(
            id,
            name,
            createdAt,
            priority,
            undefined,
            dueDate,
            undefined,
        );
    }
}

export class TaskNotFoundError extends Error {
    constructor(public readonly searchTerm?: string) {
        super();
    }
}

export class AmbiguousTaskQueryError extends Error {
    constructor(public readonly tasks: Array<Task>) {
        super();
    }
}

export class TaskAlreadyCompletedError extends Error {
    constructor(public readonly taskId: string) {
        super();
    }
}

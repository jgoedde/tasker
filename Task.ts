export class Task {
  private readonly _id: TaskId;
  private _name: string;
  private _dueDate?: Date;
  private _doneAt?: Date;
  private readonly _createdAt: Date;
  private _lastModifiedAt?: Date;

  get id(): TaskId {
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
    id: TaskId,
    name: string,
    createdAt: Date,
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
  }

  public complete(now: Date) {
    this._doneAt = now;
  }

  public changeName(name: string, now: Date) {
    this._name = name;
    this._lastModifiedAt = now;
  }

  public setNewDueDate(due: Date, now: Date) {
    this._dueDate = due;
    this._lastModifiedAt = now;
  }

  public static create(
    id: TaskId,
    name: string,
    createdAt: Date,
    dueDate?: Date,
  ) {
    return new Task(id, name, createdAt, undefined, dueDate, undefined);
  }
}

export type TaskId = string;

export class AddTaskCommand {
  constructor(public readonly task: string, public readonly dueDate?: Date) {
  }
}

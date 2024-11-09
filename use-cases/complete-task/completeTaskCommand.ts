export class CompleteTaskCommand {
  /**
   * @param id - fuzzy identifier of the task. Could be the name, the id or similar.
   */
  constructor(public readonly id: string) {
  }
}

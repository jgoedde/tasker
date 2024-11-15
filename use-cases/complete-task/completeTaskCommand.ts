export class CompleteTaskCommand {
    /**
     * Defines the command to mark a task as complete.
     *
     * @param task A fuzzy identifier of the task. Could be the name or the direct task ID.
     */
    constructor(public readonly task: string) {
    }
}

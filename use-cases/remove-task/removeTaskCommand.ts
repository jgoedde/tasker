export class RemoveTaskCommand {
    /**
     * Defines the command to delete or remove a task.
     *
     * @param task Can either be parts of the task or the task ID.
     */
    constructor(public readonly task: string) {
    }
}

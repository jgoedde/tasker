export class GetTasksQuery {
    /**
     * Defines a query to get a list of tasks based on the provided filters.
     *
     * @param includeDone When true, also tasks already marked as done shall be returned.
     * @param query An optional search string to filter tasks for. If not provided, all tasks are returned.
     */
    constructor(
        public readonly includeDone: boolean,
        public readonly query?: string,
    ) {
    }
}

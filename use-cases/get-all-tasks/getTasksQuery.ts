export class GetTasksQuery {
  constructor(
    public readonly includeDone: boolean,
    public readonly query?: string,
  ) {
  }
}

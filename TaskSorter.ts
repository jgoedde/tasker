import { Task, TaskPriority } from "./Task.ts";

class TaskDueDateComparator {
  static compare(a: Task, b: Task): number {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  }
}

class TaskPriorityComparator {
  static priorityOrder: Record<TaskPriority, number> = {
    [TaskPriority.LOW]: 1,
    [TaskPriority.STANDARD]: 2,
    [TaskPriority.HIGH]: 3,
    [TaskPriority.HIGHEST]: 4,
  };

  static compare(a: Task, b: Task): number {
    return (
      TaskPriorityComparator.priorityOrder[b.priority] -
      TaskPriorityComparator.priorityOrder[a.priority]
    );
  }
}

class TaskNameComparator {
  static compare(a: Task, b: Task): number {
    return a.name.localeCompare(b.name);
  }
}

class TaskCompletionComparator {
  static compare(a: Task, b: Task): number {
    if (a.doneAt && !b.doneAt) return 1;
    if (!a.doneAt && b.doneAt) return -1;
    return 0;
  }
}

export class TaskSorter {
  public static sort(tasks: Task[], includeDone: boolean): Task[] {
    return tasks
      .filter((task) => (includeDone ? true : task.doneAt == null))
      .sort((a, b) => {
        return (
          TaskCompletionComparator.compare(a, b) ||
          TaskDueDateComparator.compare(a, b) ||
          TaskPriorityComparator.compare(a, b) ||
          TaskNameComparator.compare(a, b)
        );
      });
  }
}

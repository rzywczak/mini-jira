export type TaskStatus = 'todo' | 'inProgress' | 'done';

export type StatusFilter = TaskStatus | 'all';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
}

export interface TaskState {
    tasks: Task[];
}

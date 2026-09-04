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

export type CreateTask = Pick<Task, 'title'> & Partial<Pick<Task, 'description' | 'status'>>;

export type UpdateTask = { id: string } & Partial<Pick<Task, 'title' | 'description' | 'status'>>;

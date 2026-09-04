import type { TaskStatus } from '../features/tasks/task.types';

export const isTaskStatus = (value: unknown): value is TaskStatus => {
    return value === 'todo' || value === 'inProgress' || value === 'done';
};

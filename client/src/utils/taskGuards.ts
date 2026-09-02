import type { TaskStatus } from '../features/tasks/tasksSlice';

export const isTaskStatus = (value: unknown): value is TaskStatus => {
    return value === 'todo' || value === 'inProgress' || value === 'done';
};

import type { Task } from '../../features/tasks/task.types';

export const mockTasks = [
    {
        id: '1',
        title: 'Task 1',
        description: 'Task 1 description',
        status: 'todo',
    },
    {
        id: '2',
        title: 'Task 2',
        description: 'Task 2 description',
        status: 'done',
    },
] satisfies Task[];

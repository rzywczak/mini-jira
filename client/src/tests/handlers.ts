import { http, HttpResponse } from 'msw';
import { mockTasks } from './fixtures/tasks.ts';

export const handlers = [
    http.get('http://localhost:3001/api/tasks', () => {
        return HttpResponse.json(mockTasks);
    }),
    http.delete('http://localhost:3001/api/tasks/:id', ({ params }) => {
        const id = String(params.id);

        const taskExists = mockTasks.some((task) => task.id === id);

        if (!taskExists) {
            return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
        }

        return HttpResponse.json({
            id,
            message: 'Task deleted',
        });
    }),
];

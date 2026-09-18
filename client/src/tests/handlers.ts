import { http, HttpResponse } from 'msw';
import { mockTasks } from './fixtures/tasks.ts';
import type { TaskStatus } from '../features/tasks/task.types.ts';

const taskStatuses = ['todo', 'inProgress', 'done'] satisfies TaskStatus[];

const isTaskStatus = (value: unknown): value is TaskStatus =>
    typeof value === 'string' && taskStatuses.some((status) => status === value);

export const handlers = [
    http.get('*/api/tasks', () => {
        return HttpResponse.json(mockTasks);
    }),
    http.delete('*/api/tasks/:id', ({ params }) => {
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
    http.post('*/api/tasks', async ({ request }) => {
        const body: unknown = await request.json();

        if (typeof body !== 'object' || body === null || Array.isArray(body)) {
            return HttpResponse.json({ message: 'Request body must be a JSON object.' }, { status: 400 });
        }

        const { title, description = '', status = 'todo' } = body as Record<string, unknown>;

        if (typeof title !== 'string' || !title.trim()) {
            return HttpResponse.json({ message: 'Title is required.' }, { status: 400 });
        }

        if (typeof description !== 'string') {
            return HttpResponse.json({ message: 'Description must be a string.' }, { status: 400 });
        }

        if (!isTaskStatus(status)) {
            return HttpResponse.json({ message: 'Invalid task status.' }, { status: 400 });
        }

        return HttpResponse.json(
            {
                id: crypto.randomUUID(),
                title: title.trim(),
                description,
                status,
            },
            { status: 201 }
        );
    }),
];

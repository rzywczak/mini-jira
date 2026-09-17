import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import Board from './Board';
import { server } from '../tests/server';
import { renderWithProviders } from '../tests/renderWithProviders';
import { mockTasks } from '../tests/fixtures/tasks';

vi.mock('@tanstack/react-virtual', () => ({
    useVirtualizer: ({ count, getItemKey }: { count: number; getItemKey: (index: number) => string }) => ({
        getTotalSize: () => count * 230,
        getVirtualItems: () =>
            Array.from({ length: count }, (_, index) => ({
                index,
                key: getItemKey(index),
                start: index * 230,
            })),
        measureElement: vi.fn(),
    }),
}));

describe('Board', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('deletes task', async () => {
        let tasks = [...mockTasks];
        const deleteTask = vi.fn();

        server.use(
            http.get('http://localhost:3001/api/tasks', () => {
                return HttpResponse.json(tasks);
            }),
            http.delete('http://localhost:3001/api/tasks/:id', ({ params }) => {
                const id = String(params.id);

                deleteTask(id);
                tasks = tasks.filter((task) => task.id !== id);

                return new HttpResponse(null, { status: 204 });
            })
        );

        const user = userEvent.setup();
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery="" />);

        expect(await screen.findByText('Task 1', { exact: true })).toBeVisible();
        expect(await screen.findByText('Task 2', { exact: true })).toBeVisible();

        await user.click(screen.getByRole('button', { name: /Usuń zadanie: Task 1/i }));

        await waitFor(() => {
            expect(screen.queryByText('Task 1', { exact: true })).not.toBeInTheDocument();
        });

        expect(screen.getByText('Task 2', { exact: true })).toBeVisible();
        expect(deleteTask).toHaveBeenCalledOnce();
        expect(deleteTask).toHaveBeenCalledWith('1');
    });
});

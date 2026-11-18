import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import Board from './Board';
import { server } from '../../tests/server';
import { renderWithProviders } from '../../tests/renderWithProviders';
import { mockTasks } from '../../tests/fixtures/tasks';
import type { Task } from '../../features/tasks/task.types';

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
    /*
     * TODO:
     * it('renders tasks in columns matching their statuses')
     * it('filters tasks by title using the search query')
     * it('shows an empty state when the API returns no tasks')
     * it('filters tasks by description using the search query')
     * it('matches the search query case-insensitively')
     * it('shows only the selected status column')
     * it('calls onUpdateTask with the selected task when edit is clicked')
     * it('does not delete a task when the confirmation is cancelled')
     * it('updates a task status when a different status is selected')
     * it('keeps the remaining tasks visible after deleting one task')
     */

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('deletes task', async () => {
        let tasks = [...mockTasks];
        const deleteTask = vi.fn();

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            }),
            http.delete('*/api/tasks/:id', ({ params }) => {
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

    it('renders tasks in columns matching their statuses', async () => {
        const tasks = [...mockTasks];

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            })
        );
        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery="" />);

        const todoColumn = screen.getByRole('region', {
            name: /do zrobienia/i,
        });

        const doneColumn = screen.getByRole('region', {
            name: /gotowe/i,
        });

        expect(await within(todoColumn).findByText('Task 1', { exact: true })).toBeVisible();
        // screen.debug(doneColumn);
        expect(await within(doneColumn).findByText('Task 2', { exact: true })).toBeVisible();
    });

    it('filters tasks by title using the search query', async () => {
        const tasks = [...mockTasks];

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            })
        );

        const taskTitle = 'Task crazy';
        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery={taskTitle} />);
        expect(await screen.findByText('Task crazy', { exact: true })).toBeInTheDocument();
        expect(screen.queryByText('Task 1', { exact: true })).not.toBeInTheDocument();
    });

    it('shows an empty state when the API returns no tasks', async () => {
        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json([]);
            })
        );
        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery="" />);

        expect(await screen.findAllByText('Nie znaleziono zadań', { exact: true })).toHaveLength(3);
    });

    it('filters tasks by description using the search query', async () => {
        const tasks = [...mockTasks];

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            })
        );

        const taskDescription = 'Task description';
        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery={taskDescription} />);
        expect(await screen.findByText('Task 2', { exact: true })).toBeInTheDocument();
        expect(screen.getByText('Task 1', { exact: true })).toBeInTheDocument();
        expect(screen.queryByText('Task crazy', { exact: true })).not.toBeInTheDocument();
    });

    it('matches the search query case-insensitively', async () => {
        const tasks = [...mockTasks];

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            })
        );

        const taskTitle = 'TASK CRAZY';
        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery={taskTitle} />);

        expect(await screen.findByText('Task crazy', { exact: true })).toBeInTheDocument();
        expect(screen.queryByText('Task 1', { exact: true })).not.toBeInTheDocument();
    });

    it('shows only the selected status column', async () => {
        const tasks = [...mockTasks];

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            })
        );

        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery="" />);

        const user = userEvent.setup();

        const select = screen.getByRole('combobox', { name: /Filtruj według statusu/i });

        await user.selectOptions(select, 'inProgress');

        expect(await screen.findByText('Task crazy', { exact: true })).toBeInTheDocument();
        expect(screen.queryByText('Task 1', { exact: true })).not.toBeInTheDocument();
    });

    it('calls onUpdateTask with the selected task when edit is clicked', async () => {
        const onUpdateTask = vi.fn();
        const tasks = [...mockTasks];

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            })
        );

        renderWithProviders(<Board onUpdateTask={onUpdateTask} searchQuery="" />);
        const user = userEvent.setup();
        expect(await screen.findByText('Task 1')).toBeInTheDocument();
        const editButtons = screen.getAllByRole('button', { name: /edit|edytuj/i });

        await user.click(editButtons[0]);

        expect(onUpdateTask).toHaveBeenCalledWith(tasks[0]);
        expect(onUpdateTask).toHaveBeenCalledTimes(1);
    });

    it('does not delete a task when the confirmation is cancelled', async () => {
        let tasks = [...mockTasks];
        const deleteTask = vi.fn();

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            }),
            http.delete('*/api/tasks/:id', ({ params }) => {
                const id = String(params.id);

                deleteTask(id);
                tasks = tasks.filter((task) => task.id !== id);

                return new HttpResponse(null, { status: 204 });
            })
        );

        const user = userEvent.setup();
        vi.spyOn(window, 'confirm').mockReturnValue(false);

        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery="" />);

        expect(await screen.findByText('Task 1', { exact: true })).toBeVisible();
        expect(await screen.findByText('Task 2', { exact: true })).toBeVisible();

        await user.click(screen.getByRole('button', { name: /Usuń zadanie: Task 1/i }));

        await waitFor(() => {
            expect(screen.queryByText('Task 1', { exact: true })).toBeVisible();
        });

        expect(screen.getByText('Task 2', { exact: true })).toBeVisible();
    });
    it('updates a task status when a different status is selected', async () => {
        let tasks: Task[] = [...mockTasks];
        const updateTask = vi.fn();

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            }),
            http.patch('*/api/tasks/:id', async ({ params, request }) => {
                const id = String(params.id);
                const body = (await request.json()) as Pick<Task, 'status'>;

                updateTask(id, body);
                tasks = tasks.map((task) => (task.id === id ? { ...task, ...body } : task));

                return HttpResponse.json(tasks.find((task) => task.id === id));
            })
        );

        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery="" />);

        const user = userEvent.setup();
        const todoColumn = screen.getByRole('region', { name: /do zrobienia/i });
        const inProgressColumn = screen.getByRole('region', { name: /w toku/i });

        expect(await within(todoColumn).findByText('Task 1', { exact: true })).toBeVisible();

        await user.selectOptions(within(todoColumn).getByRole('combobox', { name: 'Status' }), 'inProgress');

        expect(await within(inProgressColumn).findByText('Task 1', { exact: true })).toBeVisible();
        expect(within(todoColumn).queryByText('Task 1', { exact: true })).not.toBeInTheDocument();
        expect(updateTask).toHaveBeenCalledOnce();
        expect(updateTask).toHaveBeenCalledWith('1', { status: 'inProgress' });
    });

    it('keeps the remaining tasks visible after deleting one task', async () => {
        let tasks = [...mockTasks];

        server.use(
            http.get('*/api/tasks', () => {
                return HttpResponse.json(tasks);
            }),
            http.delete('*/api/tasks/:id', ({ params }) => {
                tasks = tasks.filter((task) => String(task.id) !== String(params.id));
                return new HttpResponse(null, { status: 204 });
            })
        );

        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderWithProviders(<Board onUpdateTask={vi.fn()} searchQuery="" />);

        const user = userEvent.setup();

        expect(await screen.findByText('Task 1', { exact: true })).toBeVisible();
        expect(screen.getByText('Task 2', { exact: true })).toBeVisible();
        expect(screen.getByText('Task crazy', { exact: true })).toBeVisible();

        await user.click(screen.getByRole('button', { name: 'Usuń zadanie: Task 1' }));

        await waitFor(() => {
            expect(screen.queryByText('Task 1', { exact: true })).not.toBeInTheDocument();
        });

        expect(screen.getByText('Task 2', { exact: true })).toBeVisible();
        expect(screen.getByText('Task crazy', { exact: true })).toBeVisible();
    });
});

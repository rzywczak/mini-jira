import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../../features/tasks/tasksSlice';
import type { CreateTask, Task } from '../../features/tasks/task.types';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import TaskForm from './TaskForm';
import { afterEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../tests/renderWithProviders';
import { server } from '../../tests/server';
import { http, HttpResponse } from 'msw';

describe('TaskForm', () => {
    /*
     * TODO:
     * it('renders empty fields with the todo status selected in create mode')
     * it('does not send a create request when the title is empty')
     * it('trims form values before submitting a new task')
     * it('closes the form when the cancel button is clicked')
     * it('does not close the form when the create request fails')
     * it('prefills the fields with the selected task in edit mode')
     * it('submits the edited task with its id')
     * it('does not send an update request when the edited title is empty')
     * it('does not close the form when the update request fails')
     */

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('submits a new task', async () => {
        const handleClose = vi.fn();
        const createTask = vi.fn();

        server.use(
            http.post('http://localhost:3001/api/tasks', async ({ request }) => {
                const body = (await request.json()) as CreateTask;

                createTask(body);

                return HttpResponse.json(
                    {
                        id: '3',
                        title: body.title,
                        description: body.description ?? '',
                        status: body.status ?? 'todo',
                    },
                    { status: 201 }
                );
            })
        );

        const user = userEvent.setup();

        renderWithProviders(<TaskForm handleClose={handleClose} isEditingTask={null} />);

        await user.type(screen.getByRole('textbox', { name: /Tytuł zadania/i }), 'Nowe zadanie 4');

        await user.type(screen.getByRole('textbox', { name: /Opis/i }), 'Opis zadania');

        await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'done');

        await user.click(screen.getByRole('button', { name: /Dodaj zadanie/i }));

        await waitFor(() => {
            expect(createTask).toHaveBeenCalledWith({
                title: 'Nowe zadanie 4',
                description: 'Opis zadania',
                status: 'done',
            });
        });

        expect(handleClose).toHaveBeenCalledOnce();
    });
    it('does not add a new task to store without title', async () => {
        const store = configureStore({
            reducer: taskReducer,
            preloadedState: {
                tasks: [],
            },
        });

        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <TaskForm handleClose={vi.fn()} isEditingTask={null} />
            </Provider>
        );

        await user.type(screen.getByRole('textbox', { name: /Opis/i }), 'To jest Nowe zadanie 4');
        await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'done');
        await user.click(screen.getByRole('button', { name: /Dodaj zadanie/i }));

        const tasks = store.getState().tasks;

        expect(tasks).toEqual([]);
        expect(tasks[0]).toBeUndefined();
    });
    it('updates choosen task', async () => {
        const store = configureStore({
            reducer: taskReducer,
            preloadedState: {
                tasks: [
                    { id: '1', title: 'Task 1', status: 'todo', description: 'task 1' },
                    { id: '2', title: 'Task 2', status: 'todo', description: 'task 2' },
                ],
            },
        });

        const handleClose = vi.fn();
        const user = userEvent.setup();
        const task = { id: '2', title: 'Task 2', status: 'todo', description: 'task 2' } satisfies Task;

        render(
            <Provider store={store}>
                <TaskForm handleClose={handleClose} isEditingTask={task} />
            </Provider>
        );

        expect(screen.getByRole('textbox', { name: /Tytuł zadania/i })).toHaveValue(task.title);
        expect(screen.getByRole('textbox', { name: /Opis/i })).toHaveValue(task.description);
        expect(screen.getByRole('combobox', { name: /Status/i })).toHaveValue(task.status);

        await user.clear(screen.getByRole('textbox', { name: /Tytuł zadania/i }));
        await user.type(screen.getByRole('textbox', { name: /Tytuł zadania/i }), 'Nowe zadanie 2');

        await user.clear(screen.getByRole('textbox', { name: /Opis/i }));
        await user.type(screen.getByRole('textbox', { name: /Opis/i }), 'To jest Nowe zadanie 2');
        await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'done');

        await user.click(screen.getByRole('button', { name: /Zmień/i }));

        const tasks = store.getState().tasks;

        expect(tasks.find((upadtedTask) => upadtedTask.id === task.id)).toEqual({
            id: task.id,
            title: 'Nowe zadanie 2',
            description: 'To jest Nowe zadanie 2',
            status: 'done',
        });

        expect(tasks).toHaveLength(2);

        expect(tasks.find(({ id }) => id === '1')).toEqual({
            id: '1',
            title: 'Task 1',
            status: 'todo',
            description: 'task 1',
        });

        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});

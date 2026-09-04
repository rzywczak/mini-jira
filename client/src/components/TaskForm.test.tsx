import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../features/tasks/tasksSlice';
import type { Task } from '../features/tasks/task.types';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import TaskForm from './TaskForm';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('TaskForm', () => {
    it('adds new task to store', async () => {
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

        await user.type(screen.getByRole('textbox', { name: /Tytuł zadania/i }), 'Nowe zadanie 4');
        await user.type(screen.getByRole('textbox', { name: /Opis/i }), 'To jest Nowe zadanie 4');
        await user.selectOptions(screen.getByRole('combobox', { name: /Status/i }), 'done');
        await user.click(screen.getByRole('button', { name: /Dodaj zadanie/i }));

        const tasks = store.getState().tasks;

        expect(tasks[0]).toEqual({
            id: expect.any(String),
            title: 'Nowe zadanie 4',
            description: 'To jest Nowe zadanie 4',
            status: 'done',
        });

        expect(tasks[0].id).not.toBeNull();
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

import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../features/tasks/tasksSlice';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import { describe, expect, it, vi, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Board from './Board';
import { tasksApi } from '../services/tasksApi';

// TODO: rewrite all tests to be compatible with RTK Query and MSW
describe('Board', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('deletes task', async () => {
        // const store = configureStore({
        //     reducer: taskReducer,
        //     preloadedState: {
        //         tasks: [
        //             { id: '1', title: 'Task 1', status: 'todo', description: 'task 1' },
        //             { id: '2', title: 'Task 2', status: 'todo', description: 'task 2' },
        //         ],
        //     },
        // });

        const store = configureStore({
            reducer: {
                [tasksApi.reducerPath]: tasksApi.reducer,
            },
            middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tasksApi.middleware),
        });

        const user = userEvent.setup();

        render(
            <Provider store={store}>
                <Board onUpdateTask={vi.fn()} searchQuery="" />
            </Provider>
        );

        vi.spyOn(window, 'confirm').mockReturnValue(true);

        expect(screen.getByText('Task 1', { exact: true })).toBeVisible();
        expect(screen.getByText('Task 2', { exact: true })).toBeVisible();

        await user.click(screen.getByRole('button', { name: /Usuń zadanie: Task 1/i }));

        const tasks = store.getState().tasks;

        expect(screen.getByText('Task 2', { exact: true })).toBeVisible();
        expect(screen.queryByText('Task 1', { exact: true })).not.toBeInTheDocument();
        expect(tasks).toEqual([{ id: '2', title: 'Task 2', status: 'todo', description: 'task 2' }]);
    });
});

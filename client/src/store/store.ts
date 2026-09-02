import { configureStore } from '@reduxjs/toolkit';
import tasks from '../features/tasks/tasksSlice';
import { setTasks } from './tasksStore';

export const store = configureStore({
    reducer: tasks,
});

store.subscribe(() => {
    setTasks(store.getState().tasks);
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

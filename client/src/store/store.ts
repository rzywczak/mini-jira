import { configureStore } from '@reduxjs/toolkit';
import tasks from '../features/tasks/tasksSlice';
import { tasksApi } from '../services/tasksApi';

export const store = configureStore({
    reducer: {
        tasks,
        [tasksApi.reducerPath]: tasksApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tasksApi.middleware),
});

store.subscribe(() => {});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

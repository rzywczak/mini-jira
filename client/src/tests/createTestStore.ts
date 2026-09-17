import { configureStore } from '@reduxjs/toolkit';

import { tasksApi } from '../services/tasksApi';

export const createTestStore = () => {
    return configureStore({
        reducer: {
            [tasksApi.reducerPath]: tasksApi.reducer,
        },
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(tasksApi.middleware),
    });
};

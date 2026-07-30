import { configureStore } from '@reduxjs/toolkit';
// import tasksReducer from '../features/tasks/tasksSlice';

const emptyReducer = (state = {}) => state;

export const store = configureStore({
    reducer: emptyReducer,
});

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

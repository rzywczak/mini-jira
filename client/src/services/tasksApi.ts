import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CreateTask, Task, UpdateTask } from '../features/tasks/task.types';

export const tasksApi = createApi({
    reducerPath: 'taskApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    tagTypes: ['Task'],
    endpoints: (builder) => ({
        getTasks: builder.query<Task[], void>({
            query: () => `tasks`,
            providesTags: ['Task'],
        }),
        addTask: builder.mutation<Task, CreateTask>({
            query(body) {
                return {
                    url: `tasks`,
                    method: 'POST',
                    body,
                };
            },
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation<Task, UpdateTask>({
            query(data) {
                const { id, ...body } = data;
                return {
                    url: `tasks/${id}`,
                    method: 'PATCH',
                    body,
                };
            },
            invalidatesTags: ['Task'],
        }),
        deleteTask: builder.mutation<void, string>({
            query(id) {
                return {
                    url: `tasks/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Task'],
        }),
    }),
});

export const { useGetTasksQuery, useAddTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = tasksApi;

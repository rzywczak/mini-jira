import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type TaskStatus = 'todo' | 'inProgress' | 'done';

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
}

interface TaskState {
    tasks: Task[];
}

const initialState: TaskState = {
    tasks: [
        {
            id: '1',
            title: 'task-1',
            description: 'task 1 description',
            status: 'todo',
        },
        {
            id: '2',
            title: 'task-2',
            description: 'task 2 description',
            status: 'inProgress',
        },
        {
            id: '3',
            title: 'task-3',
            description: 'task 3 description',
            status: 'done',
        },
    ],
};

const taskSlice = createSlice({
    name: 'tasks',
    initialState: initialState,
    reducers: {
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },
        changeTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
            const task = state.tasks.find((task) => task.id === action.payload.id);

            if (!task) return;

            task.status = action.payload.status;
        },
        deleteTask: (state, action: PayloadAction<{ id: string }>) => {
            const filteredTasks = state.tasks.filter((task) => task.id !== action.payload.id);
            state.tasks = filteredTasks;
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const task = state.tasks.find((task) => task.id === action.payload.id);

            if (!task) return;

            Object.assign(task, action.payload);
        },
    },
});

export const { addTask, changeTaskStatus, deleteTask, updateTask } = taskSlice.actions;

export default taskSlice.reducer;

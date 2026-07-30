// import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// export type TaskStatus = 'todo' | 'inProgress' | 'done';

// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
// }

// interface TasksState {
//   tasks: Task[];
// }

// const initialState: TasksState = {
//     tasks: [],
// };

// const tasksSlice = createSlice({
//     name: 'tasks',
//     initialState,
//     reducers: {
//         addTask: (state, action: PayloadAction<Task>) => {
//             state.tasks.push(action.payload);
//         },
//     },
// });

// export const { addTask } = tasksSlice.actions;

// export default tasksSlice.reducer;

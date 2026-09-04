import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { Task, TaskState } from './task.types';
import taskReducer, { addTask, changeTaskStatus, updateTask, deleteTask } from './tasksSlice';

const mockTasks = [
    { id: '1', title: 'Task 1', status: 'todo', description: 'task 1' },
    { id: '2', title: 'Task 2', status: 'todo', description: 'task 2' },
    { id: '3', title: 'Task 3', status: 'todo', description: 'task 3' },
] satisfies Task[];

describe('task slice reducers', () => {
    it('adds task', () => {
        const state: TaskState = {
            tasks: [],
        };

        const result = taskReducer(state, addTask(mockTasks[0]));

        expect(result.tasks).toHaveLength(1);
        expect(result.tasks[0]).toEqual(mockTasks[0]);
    });

    it('changes task status', () => {
        const state: TaskState = {
            tasks: mockTasks,
        };

        const result = taskReducer(state, changeTaskStatus({ id: '2', status: 'done' }));
        const task = result.tasks.find((task) => task.id === '2');
        expect(task).toHaveProperty('status', 'done');
        expect(result.tasks).toEqual([mockTasks[0], task, mockTasks[2]]);
    });

    it('deletes task', () => {
        const state: TaskState = {
            tasks: mockTasks,
        };

        const result = taskReducer(state, deleteTask({ id: '1' }));
        const deletedTask = result.tasks.some((task) => task.id === '1');

        expect(deletedTask).toBeFalsy();
        expect(result.tasks).toEqual([mockTasks[1], mockTasks[2]]);
    });

    it('updates task', () => {
        const state: TaskState = {
            tasks: mockTasks,
        };

        const result = taskReducer(state, updateTask({ id: '3', title: 'Task 33333', status: 'done', description: 'modified description' }));

        const task = result.tasks.find((task) => task.id === '3');

        expect(task).toEqual({ id: '3', title: 'Task 33333', status: 'done', description: 'modified description' });
    });
});

// TODO: start to test components f,e

// const mockUpdateTask = vi.fn();

// const column = { status: 'todo', title: 'Do zrobienia' } satisfies { status: TaskStatus; title: string };

// describe('countTask', () => {
//     it('count amount of tasks', () => {
//         render(<Column tasks={mockTasks} status={column.status} title={column.title} onUpdateTask={mockUpdateTask} />);

//         expect(screen.getByLabelText('3 zadań')).toBeInTheDocument();
//     });
// });

// test('otwiera edycję po kliknięciu zadania', async () => {
//   const user = userEvent.setup();

//   render(<TaskCard task={mockTask} />);

//   await user.click(
//     screen.getByText('Nauczyć się testów')
//   );

//   expect(
//     screen.getByRole('dialog')
//   ).toBeInTheDocument();
// });

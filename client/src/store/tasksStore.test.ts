import { beforeEach, describe, expect, it } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { loadTasks, setTasks } from './tasksStore';
import type { Task } from '../features/tasks/task.types';

const mockTasks = [
    { id: '1', title: 'Task 1', status: 'todo', description: 'task 1' },
    { id: '2', title: 'Task 2', status: 'todo', description: 'task 2' },
    { id: '3', title: 'Task 3', status: 'todo', description: 'task 3' },
] satisfies Task[];

beforeEach(() => {
    localStorage.clear();
});

describe('Local Storage functions', () => {
    it('saves tasks to localstorage', () => {
        setTasks(mockTasks);

        const tasks = localStorage.getItem('tasks');

        expect(tasks).not.toBeNull();
        expect(JSON.parse(tasks!)).toEqual(mockTasks);
    });

    it('loads tasks from localstorage', () => {
        localStorage.setItem('tasks', JSON.stringify(mockTasks));

        const tasks = loadTasks();

        expect(tasks).toEqual(mockTasks);
    });
    it('returns empty array when localstorage is empty', () => {
        const tasks = loadTasks();

        expect(tasks).toEqual([]);
    });

    it('returns empty array while json is invalid', () => {
        localStorage.setItem('tasks', '{invalid json');

        const tasks = loadTasks();

        expect(tasks).toEqual([]);
    });

    it('loads saved empty array to local storages', () => {
        localStorage.setItem('tasks', JSON.stringify([]));

        const tasks = loadTasks();

        expect(tasks).toEqual([]);
    });
});

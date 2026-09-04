import type { Task } from '../features/tasks/task.types';

// LEGACY: old feature replaced by storage in database on backend
export const loadTasks = () => {
    try {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
        return [];
    }
};

// LEGACY: old feature replaced by storage in database on backend
export const setTasks = (tasks: Task[]) => {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Unable to save in local storage', error);
    }
};

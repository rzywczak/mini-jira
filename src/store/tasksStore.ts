import type { Task } from '../features/tasks/tasksSlice';

export const loadTasks = () => {
    try {
        const savedTasks = localStorage.getItem('tasks');
        return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
        return [];
    }
};

export const setTasks = (tasks: Task[]) => {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
        console.error('Unable to save in     local storage', error);
    }
};

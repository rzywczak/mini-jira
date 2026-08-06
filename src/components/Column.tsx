import React from 'react';
import type { Task, TaskStatus } from '../features/tasks/tasksSlice';

interface ColumnProps {
    tasks: Task[];
    title: string;
    key: TaskStatus;
}

const Column = ({ tasks, title }: ColumnProps) => {
    return (
        <section>
            Column - {title}
            <ul>
                {tasks.map((task) => (
                    <li>
                        {task.title}
                        {task.description}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Column;

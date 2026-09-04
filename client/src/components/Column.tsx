import type { Task, TaskStatus } from '../features/tasks/task.types';
import TaskCard from './TaskCard';
import './Column.scss';
import { useDroppable } from '@dnd-kit/react';

interface ColumnProps {
    tasks: Task[];
    title: string;
    status: TaskStatus;
    onUpdateTask: (task: Task) => void;
}

const Column = ({ tasks, title, status, onUpdateTask }: ColumnProps) => {
    const { ref } = useDroppable({
        id: status,
    });

    return (
        <section ref={ref} className={`column column--${status}`}>
            <div className="column__header">
                <div className="column__title-wrap">
                    <span className="column__status-dot" aria-hidden="true" />
                    <h3>{title}</h3>
                </div>
                <span className="column__count" aria-label={`${tasks.length} zadań`}>
                    {tasks.length}
                </span>
            </div>

            <ul className="column__tasks">
                {tasks.length === 0 ? (
                    <div>Nie znaleziono zadań</div>
                ) : (
                    tasks.map((task) => (
                        <li key={task.id}>
                            <TaskCard onUpdateTask={onUpdateTask} task={task} />
                        </li>
                    ))
                )}
            </ul>
        </section>
    );
};

export default Column;

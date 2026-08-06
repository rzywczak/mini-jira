import type { Task, TaskStatus } from '../features/tasks/tasksSlice';
import TaskCard from './TaskCard';
import './Column.scss';

interface ColumnProps {
    tasks: Task[];
    title: string;
    status: TaskStatus;
}

const Column = ({ tasks, title, status }: ColumnProps) => {
    return (
        <section className={`column column--${status}`}>
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
                {tasks.map((task) => (
                    <li key={task.id}>
                        <TaskCard task={task} />
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Column;

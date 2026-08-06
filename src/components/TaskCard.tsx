import type { Task } from '../features/tasks/tasksSlice';
import './Taskcard.scss';

interface TaskCardProps {
    task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
    return (
        <article className="task-card">
            <span className="task-card__type">Zadanie</span>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div className="task-card__footer">
                <span className="task-card__key">MJ-{task.id}</span>
                <span className="task-card__avatar" aria-label="Nieprzypisane">
                    ?
                </span>
            </div>
        </article>
    );
};

export default TaskCard;

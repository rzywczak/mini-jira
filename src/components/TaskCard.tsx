import { changeTaskStatus, type Task, type TaskStatus } from '../features/tasks/tasksSlice';
import { useAppDispatch } from '../store/hooks';

import './Taskcard.scss';
interface TaskCardProps {
    task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
    const dispatch = useAppDispatch();

    const statusId = `task-status-${task.id}`;

    const handleChangeTaskStatus = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(
            changeTaskStatus({
                id: task.id,
                status: e.target.value as TaskStatus,
            })
        );
    };

    return (
        <article className="task-card">
            <span className="task-card__type">Zadanie</span>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <label htmlFor={statusId}>Status</label>
            <select id={statusId} name="status" defaultValue={task.status} onChange={handleChangeTaskStatus}>
                <option value="todo">Do zrobienia</option>
                <option value="inProgress">W toku</option>
                <option value="done">Gotowe</option>
            </select>
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

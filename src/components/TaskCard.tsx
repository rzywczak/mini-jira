import { changeTaskStatus, deleteTask, type Task, type TaskStatus } from '../features/tasks/tasksSlice';
import { useAppDispatch } from '../store/hooks';

import './Taskcard.scss';
interface TaskCardProps {
    task: Task;
    onUpdateTask: (task: Task) => void;
}

const TaskCard = ({ task, onUpdateTask: handleOnUpdateTask }: TaskCardProps) => {
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

    const handleDeleteTask = () => {
        if (!window.confirm(`Czy usunąć zadanie „${task.title}”?`)) {
            return;
        }

        dispatch(
            deleteTask({
                id: task.id,
            })
        );
    };

    return (
        <article className="task-card">
            <div className="task-card__header">
                <span className="task-card__type">Zadanie</span>
                <div className="task-card__actions" role="group" aria-label="Akcje zadania">
                    <button
                        className="task-card__action task-card__action--edit"
                        type="button"
                        onClick={() => handleOnUpdateTask(task)}
                        aria-label={`Edytuj zadanie: ${task.title}`}
                        title="Edytuj zadanie"
                    >
                        <svg className="task-card__action-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 16.5V20h3.5L18.2 9.3l-3.5-3.5L4 16.5Zm16.7-9.7a1 1 0 0 0 0-1.4l-2.1-2.1a1 1 0 0 0-1.4 0l-1.7 1.7L19 8.5l1.7-1.7Z" />
                        </svg>
                    </button>
                    <button
                        className="task-card__action task-card__action--delete"
                        type="button"
                        onClick={handleDeleteTask}
                        aria-label={`Usuń zadanie: ${task.title}`}
                        title="Usuń zadanie"
                    >
                        <svg className="task-card__action-icon" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M9 3h6l1 2h4v2H4V5h4l1-2Zm-2 6h10l-.7 11H7.7L7 9Zm3 2v7h2v-7h-2Zm4 0v7h2v-7h-2Z" />
                        </svg>
                    </button>
                </div>
            </div>
            <h4>{task.title}</h4>
            <p>{task.description}</p>
            <div className="task-card__status-field">
                <label className="task-card__status-label" htmlFor={statusId}>
                    Status
                </label>
                <select className="task-card__status-select" id={statusId} name="status" defaultValue={task.status} onChange={handleChangeTaskStatus}>
                    <option value="todo">Do zrobienia</option>
                    <option value="inProgress">W toku</option>
                    <option value="done">Gotowe</option>
                </select>
            </div>
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

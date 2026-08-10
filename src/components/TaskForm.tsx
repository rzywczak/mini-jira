import { useAppDispatch } from '../store/hooks';
import { addTask, updateTask } from '../features/tasks/tasksSlice';
import type { Task, TaskStatus } from '../features/tasks/tasksSlice';
import './TaskForm.scss';

interface TaskFormProps {
    handleClose: () => void;
    isEditingTask: Task | null;
}

const TaskForm = ({ handleClose, isEditingTask: task }: TaskFormProps) => {
    const dispatch = useAppDispatch();

    const handleAddTask = (formData: FormData) => {
        const title = String(formData.get('title')).trim();
        const description = String(formData.get('description')).trim();
        const status = String(formData.get('status')).trim() as TaskStatus;
        const id = crypto.randomUUID();

        const newTask = { id, title, description, status };

        if (!title) {
            return;
        }

        dispatch(addTask(newTask));
        handleClose();
    };

    const handleEditTask = (formData: FormData) => {
        const title = String(formData.get('title')).trim();
        const description = String(formData.get('description')).trim();
        const status = String(formData.get('status')).trim() as TaskStatus;

        if (!task) return;

        const updatedTask = { id: task.id, title, description, status };
        if (!title) {
            return;
        }

        dispatch(updateTask(updatedTask));
        handleClose();
    };

    return (
        <form className="task-form" action={task ? handleEditTask : handleAddTask}>
            <div className="task-form__header">
                <div>
                    <p className="task-form__eyebrow"> {task ? 'Edytuj zadanie' : 'Nowe zadanie'}</p>
                    <h2> {task ? 'Zmodyfikuj zadanie dodane do tablicy' : 'Dodaj zadanie do tablicy'}</h2>
                    <p className="task-form__description"> {task ? '' : 'Dodaj podstawowe informacje i wybierz status'}</p>
                </div>

                <button className="task-form__close" type="button" onClick={handleClose} aria-label="Zamknij formularz">
                    ×
                </button>
            </div>

            <div className="task-form__fields">
                <div className="task-form__field">
                    <label htmlFor="task-title">Tytuł zadania</label>
                    <input id="task-title" defaultValue={task?.title} name="title" type="text" placeholder="Np. Utworzyć formularz" required autoFocus />
                </div>

                <div className="task-form__field">
                    <label htmlFor="task-description">Opis</label>
                    <textarea id="task-description" defaultValue={task?.description} name="description" placeholder="Opisz zadanie..." rows={4} />
                </div>

                <div className="task-form__field">
                    <label htmlFor="task-status">Status</label>
                    <select id="task-status" name="status" defaultValue={task?.status ?? 'todo'}>
                        <option value="todo">Do zrobienia</option>
                        <option value="inProgress">W toku</option>
                        <option value="done">Gotowe</option>
                    </select>
                </div>
            </div>

            <div className="task-form__actions">
                <button className="task-form__button task-form__button--secondary" type="button" onClick={handleClose}>
                    Anuluj
                </button>
                <button className="task-form__button task-form__button--primary" type="submit">
                    {task ? 'Zmień' : 'Dodaj zadanie'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;

import { useAppDispatch } from '../store/hooks';
import { addTask } from '../features/tasks/tasksSlice';
import type { TaskStatus } from '../features/tasks/tasksSlice';
import './TaskForm.scss';

interface TaskFormProps {
    handleClose: () => void;
}

const TaskForm = ({ handleClose }: TaskFormProps) => {
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

    return (
        <form className="task-form" action={handleAddTask}>
            <div className="task-form__header">
                <div>
                    <p className="task-form__eyebrow">Nowe zadanie</p>
                    <h2>Dodaj zadanie do tablicy</h2>
                    <p className="task-form__description">Uzupełnij podstawowe informacje i wybierz status.</p>
                </div>

                <button className="task-form__close" type="button" onClick={handleClose} aria-label="Zamknij formularz">
                    ×
                </button>
            </div>

            <div className="task-form__fields">
                <div className="task-form__field">
                    <label htmlFor="task-title">Tytuł zadania</label>
                    <input id="task-title" name="title" type="text" placeholder="Np. Utworzyć formularz" required autoFocus />
                </div>

                <div className="task-form__field">
                    <label htmlFor="task-description">Opis</label>
                    <textarea id="task-description" name="description" placeholder="Opisz zadanie..." rows={4} />
                </div>

                <div className="task-form__field">
                    <label htmlFor="task-status">Status</label>
                    <select id="task-status" name="status" defaultValue="todo">
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
                    Dodaj zadanie
                </button>
            </div>
        </form>
    );
};

export default TaskForm;

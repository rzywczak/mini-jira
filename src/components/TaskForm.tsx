import { useAppDispatch } from '../store/hooks';
import { addTask } from '../features/tasks/tasksSlice';
import type { TaskStatus } from '../features/tasks/tasksSlice';

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

    const handleCloseFormModal = () => {
        handleClose();
    };

    return (
        <form action={(e) => handleAddTask(e)}>
            <div>
                <label htmlFor="task-title">Tytuł zadania</label>

                <input id="task-title" name="title" type="text" placeholder="Np. Utworzyć formularz" required />
            </div>

            <div>
                <label htmlFor="task-description">Opis</label>

                <textarea id="task-description" name="description" placeholder="Opisz zadanie..." rows={4} />
            </div>

            <div>
                <label htmlFor="task-status">Status</label>

                <select id="task-status" name="status" defaultValue="todo">
                    <option value="todo">Do zrobienia</option>
                    <option value="inProgress">W toku</option>
                    <option value="done">Gotowe</option>
                </select>
            </div>

            <div>
                <button type="button" onClick={handleCloseFormModal}>
                    Anuluj
                </button>

                <button type="submit">Dodaj zadanie</button>
            </div>
        </form>
    );
};

export default TaskForm;

import Modal from './Modal';
import TaskForm from './TaskForm';
import type { Task } from '../features/tasks/tasksSlice';
import './TaskModal.scss';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditingTask: Task | null;
}

const TaskModal = ({ isOpen, onClose, isEditingTask }: TaskModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="task-modal">
            <TaskForm isEditingTask={isEditingTask} handleClose={onClose} />
        </Modal>
    );
};

export default TaskModal;

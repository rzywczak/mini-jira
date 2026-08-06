import Modal from './Modal';
import TaskForm from './TaskForm';
import './TaskModal.scss';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TaskModal = ({ isOpen, onClose }: TaskModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} className="task-modal">
            <TaskForm handleClose={onClose} />
        </Modal>
    );
};

export default TaskModal;

import React from 'react';
import Modal from './Modal';
import TaskForm from './TaskForm';

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TaskModal = ({ isOpen, onClose }: TaskModalProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <TaskForm />
        </Modal>
    );
};

export default TaskModal;

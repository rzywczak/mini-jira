import TaskModal from './TaskModal';
import type { Task } from '../features/tasks/tasksSlice';

type Props = {
    onAddTask: () => void;
    onCloseTaskModal: () => void;
    isTaskModalOpen: boolean;
    editingTask: Task | null;
    onSearchQuery: (searchValue: string) => void;
    searchQuery: string;
};

const Header = ({ onAddTask, isTaskModalOpen, editingTask, onCloseTaskModal, onSearchQuery, searchQuery }: Props) => {
    return (
        <header className="app-header">
            <div className="app-header__brand">
                <span className="app-header__logo" aria-hidden="true">
                    M
                </span>
                <div>
                    <strong className="app-header__title">Mega Jira</strong>
                    <span className="app-header__subtitle">Zarządzanie projektem</span>
                </div>
            </div>
            <div>
                <label htmlFor="search-task">Wyszukaj</label>
                <input type="search" id="search-task" value={searchQuery} onChange={(e) => onSearchQuery(e.target.value)} />
            </div>
            <button className="add-task-button" type="button" onClick={onAddTask}>
                + Dodaj zadanie
            </button>
            {isTaskModalOpen && <TaskModal isEditingTask={editingTask} isOpen={isTaskModalOpen} onClose={onCloseTaskModal} />}
        </header>
    );
};

export default Header;

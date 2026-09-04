import TaskModal from './TaskModal';
import type { Task } from '../features/tasks/task.types';

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
            <div className="app-header__search">
                <label className="app-header__search-label" htmlFor="search-task">
                    Wyszukaj zadanie
                </label>
                <span className="app-header__search-icon" aria-hidden="true" />
                <input
                    className="app-header__search-input"
                    type="search"
                    id="search-task"
                    placeholder="Wyszukaj zadanie..."
                    value={searchQuery}
                    onChange={(event) => onSearchQuery(event.target.value)}
                />
            </div>
            <button className="add-task-button" type="button" onClick={onAddTask}>
                + Dodaj zadanie
            </button>
            {isTaskModalOpen && <TaskModal isEditingTask={editingTask} isOpen={isTaskModalOpen} onClose={onCloseTaskModal} />}
        </header>
    );
};

export default Header;

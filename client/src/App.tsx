import './App.scss';
import { type Task } from './features/tasks/tasksSlice';
// import { useAppDispatch } from './store/hooks';
import Board from './components/Board';
import Header from './components/Header';

import { useState } from 'react';

function App() {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenModalAddNewTask = () => {
        setIsTaskModalOpen(true);
        setEditingTask(null);
    };

    const handleOpenModalUpdateTask = (task: Task) => {
        setIsTaskModalOpen(true);
        setEditingTask(task);
    };

    const handleSearchQueryChange = (value: string) => {
        setSearchQuery(value);
    };

    return (
        <div className="app">
            <Header
                onAddTask={handleOpenModalAddNewTask}
                isTaskModalOpen={isTaskModalOpen}
                editingTask={editingTask}
                onCloseTaskModal={() => setIsTaskModalOpen(false)}
                onSearchQuery={handleSearchQueryChange}
                searchQuery={searchQuery}
            />
            <main className="app-main">
                <div className="page-intro">
                    <p className="page-intro__eyebrow">Projekt Mega Jira</p>
                    <h1>Tablica projektu</h1>
                    <p className="page-intro__description">Prosty podgląd pracy zespołu — od pomysłu aż do ukończenia zadania.</p>
                </div>

                <Board onUpdateTask={handleOpenModalUpdateTask} searchQuery={searchQuery} />
            </main>
        </div>
    );
}

export default App;

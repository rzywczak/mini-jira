import './App.scss';
// import { addTask, type Task } from './features/tasks/tasksSlice';
// import { useAppDispatch } from './store/hooks';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import { useState } from 'react';

function App() {
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    // const dispatch = useAppDispatch();

    const handleOpenModalAddNewTask = () => {
        setIsTaskModalOpen(true);

        // const task: Task = {
        //     id: Date.now(),
        //     title: 'Nowe zadanie',
        //     description: 'Uzupełnij szczegóły tego zadania.',
        //     status: 'todo',
        // };

        // dispatch(addTask(task));
    };

    return (
        <div className="app">
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

                <button className="add-task-button" type="button" onClick={handleOpenModalAddNewTask}>
                    + Dodaj zadanie
                </button>
                {isTaskModalOpen && <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} />}
            </header>

            <main className="app-main">
                <div className="page-intro">
                    <p className="page-intro__eyebrow">Projekt Mega Jira</p>
                    <h1>Tablica projektu</h1>
                    <p className="page-intro__description">Prosty podgląd pracy zespołu — od pomysłu aż do ukończenia zadania.</p>
                </div>

                <Board />
            </main>
        </div>
    );
}

export default App;

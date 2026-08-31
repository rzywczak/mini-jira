import type { Task, TaskStatus, StatusFilter } from '../features/tasks/tasksSlice';
import Column from './Column';
import { useAppSelector } from '../store/hooks';
import './Board.scss';
import { useState } from 'react';

const columns = [
    { status: 'todo', title: 'Do zrobienia' },
    { status: 'inProgress', title: 'W toku' },
    { status: 'done', title: 'Gotowe' },
] satisfies readonly { status: TaskStatus; title: string }[];

const statusFilters = [{ status: 'all', title: 'Wszystkie' }, ...columns] satisfies readonly { status: StatusFilter; title: string }[];

interface BoardProps {
    onUpdateTask: (task: Task) => void;
    searchQuery: string;
}

const Board = ({ onUpdateTask, searchQuery }: BoardProps) => {
    const [statusFilter, setStatusFilter] = useState('all');

    const tasks = useAppSelector((state) => state.tasks);
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();

    const filteredTasks = tasks.filter(({ title, description, status }) => {
        const filterTitle = title.trim().toLocaleLowerCase().includes(normalizedSearch);
        const filtrerDescription = description.trim().toLocaleLowerCase().includes(normalizedSearch);
        const matchSearch = filterTitle || filtrerDescription;
        const matchStatus = status === statusFilter || statusFilter === 'all';
        return matchSearch && matchStatus;
    });

    const filteredColumns = columns.filter((column) => column.status === statusFilter || statusFilter === 'all');

    return (
        <section className="board" aria-labelledby="board-heading">
            <div className="board__header">
                <div>
                    <h2 id="board-heading">Tablica zadań</h2>
                    <p>Aktualny stan prac w projekcie</p>
                </div>
                <div>
                    Filtruj
                    <select name="board-filter" id="board-filter" defaultValue={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        {statusFilters.map((statusFilter) => {
                            const status = statusFilter.status;
                            const title = statusFilter.title;

                            return <option value={status}>{title}</option>;
                        })}
                    </select>
                </div>
            </div>

            <div className="board__columns">
                {filteredColumns.map((column) => (
                    <Column
                        onUpdateTask={onUpdateTask}
                        key={column.status}
                        status={column.status}
                        title={column.title}
                        tasks={filteredTasks.filter((task) => task.status === column.status)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Board;

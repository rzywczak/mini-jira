import { changeTaskStatus } from '../features/tasks/tasksSlice';
import type { Task, TaskStatus, StatusFilter } from '../features/tasks/task.types';
import Column from './Column';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import './Board.scss';
import { useState } from 'react';
import { DragDropProvider } from '@dnd-kit/react';
import { isTaskStatus } from '../utils/taskGuards';

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

    const dispatch = useAppDispatch();

    const tasks = useAppSelector((state) => state.tasks);
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();

    const filteredTasks = tasks.filter(({ title, description, status }) => {
        const filterTitle = title.trim().toLocaleLowerCase().includes(normalizedSearch);
        const filtrerDescription = description.trim().toLocaleLowerCase().includes(normalizedSearch);
        const matchSearch = filterTitle || filtrerDescription;
        const matchStatus = status === statusFilter || statusFilter === 'all';
        return matchSearch && matchStatus;
    });

    const filteredColumns = statusFilter === 'all' ? columns : columns.filter((column) => column.status === statusFilter);

    return (
        <section className="board" aria-labelledby="board-heading">
            <div className="board__header">
                <div>
                    <h2 id="board-heading">Tablica zadań</h2>
                    <p>Aktualny stan prac w projekcie</p>
                </div>
                <div className="board__filter">
                    <label className="board__filter-label" htmlFor="board-filter">
                        Filtruj według statusu
                    </label>
                    <select className="board__filter-select" name="board-filter" id="board-filter" defaultValue={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        {statusFilters.map((statusFilter) => {
                            const status = statusFilter.status;
                            const title = statusFilter.title;

                            return (
                                <option key={status} value={status}>
                                    {title}
                                </option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="board__columns">
                <DragDropProvider
                    onDragEnd={(event) => {
                        if (event.canceled) return;

                        const { target, source } = event.operation;

                        if (!source || !target || !isTaskStatus(target.id)) return;

                        dispatch(
                            changeTaskStatus({
                                id: String(source.id),
                                status: target.id,
                            })
                        );
                    }}>
                    {filteredColumns.map((column) => (
                        <Column
                            onUpdateTask={onUpdateTask}
                            key={column.status}
                            status={column.status}
                            title={column.title}
                            tasks={filteredTasks.filter((task) => task.status === column.status)}
                        />
                    ))}
                </DragDropProvider>
            </div>
        </section>
    );
};

export default Board;

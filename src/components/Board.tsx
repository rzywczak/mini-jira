import type { TaskStatus } from '../features/tasks/tasksSlice';
import Column from './Column';
import { useAppSelector } from '../store/hooks';
import './Board.scss';

const columns = [
    { status: 'todo', title: 'Do zrobienia' },
    { status: 'inProgress', title: 'W toku' },
    { status: 'done', title: 'Gotowe' },
] satisfies { status: TaskStatus; title: string }[];

const Board = () => {
    const tasks = useAppSelector((state) => state.tasks);

    return (
        <section className="board" aria-labelledby="board-heading">
            <div className="board__header">
                <div>
                    <h2 id="board-heading">Tablica zadań</h2>
                    <p>Aktualny stan prac w projekcie</p>
                </div>
                <span className="board__total">{tasks.length} zadań</span>
            </div>

            <div className="board__columns">
                {columns.map((column) => (
                    <Column key={column.status} status={column.status} title={column.title} tasks={tasks.filter((task) => task.status === column.status)} />
                ))}
            </div>
        </section>
    );
};

export default Board;

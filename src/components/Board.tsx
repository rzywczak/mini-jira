import type { Task, TaskStatus } from '../features/tasks/tasksSlice';
import Column from './Column';
import { useAppSelector } from '../store/hooks';
import './Board.scss';

const columns = [
    { status: 'todo', title: 'Do zrobienia' },
    { status: 'inProgress', title: 'W toku' },
    { status: 'done', title: 'Gotowe' },
] satisfies { status: TaskStatus; title: string }[];

interface BoardProps {
    onUpdateTask: (task: Task) => void;
    searchQuery: string;
}

const Board = ({ onUpdateTask, searchQuery }: BoardProps) => {
    const tasks = useAppSelector((state) => state.tasks);

    const normalizedSearch = searchQuery.trim().toLocaleLowerCase();

    const filteredTasks = tasks.filter(
        ({ title, description }) => title.trim().toLocaleLowerCase().includes(normalizedSearch) || description.trim().toLocaleLowerCase().includes(normalizedSearch)
    );

    return (
        <section className="board" aria-labelledby="board-heading">
            <div className="board__header">
                <div>
                    <h2 id="board-heading">Tablica zadań</h2>
                    <p>Aktualny stan prac w projekcie</p>
                </div>
                <span className="board__total">{filteredTasks.length} zadań</span>
            </div>

            <div className="board__columns">
                {columns.map((column) => (
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

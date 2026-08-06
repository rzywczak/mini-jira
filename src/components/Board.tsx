import type { TaskStatus } from '../features/tasks/tasksSlice';
import Column from './Column';
import { useAppSelector } from '../store/hooks';

const columns = [
    { status: 'todo', title: 'To do' },
    { status: 'inProgress', title: 'In progress' },
    { status: 'done', title: 'done' },
] satisfies { status: TaskStatus; title: string }[];

const Board = () => {
    const tasks = useAppSelector((state) => state.tasks);

    return (
        <section>
            <p>Tablica zadań</p>

            {columns.map((column) => (
                <Column key={column.status} title={column.title} tasks={tasks.filter((task) => task.status === column.status)} />
            ))}
        </section>
    );
};

export default Board;

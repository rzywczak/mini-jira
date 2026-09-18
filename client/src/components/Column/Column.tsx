import type { Task, TaskStatus } from '../../features/tasks/task.types';
import TaskCard from '../TaskCard/TaskCard';
import './Column.scss';
import { useDroppable } from '@dnd-kit/react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface ColumnProps {
    tasks: Task[];
    title: string;
    status: TaskStatus;
    onUpdateTask: (task: Task) => void;
}

const Column = ({ tasks, title, status, onUpdateTask }: ColumnProps) => {
    const { ref } = useDroppable({
        id: status,
    });

    const parentRef = useRef(null);

    const taskVirtualizer = useVirtualizer({
        count: tasks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 270,
        getItemKey: (index) => tasks[index].id,
        gap: 10,
        overscan: 3,
    });

    return (
        <section ref={ref} className={`column column--${status}`}>
            <div className="column__header">
                <div className="column__title-wrap">
                    <span className="column__status-dot" aria-hidden="true" />
                    <h3>{title}</h3>
                </div>
                <span className="column__count" aria-label={`${tasks.length} zadań`}>
                    {tasks.length}
                </span>
            </div>
            <div ref={parentRef} className="column__tasks-scroll">
                <ul
                    className="column__tasks "
                    style={{
                        height: `${taskVirtualizer.getTotalSize()}px`,
                    }}>
                    {tasks.length === 0 ? (
                        <li>Nie znaleziono zadań</li>
                    ) : (
                        taskVirtualizer.getVirtualItems().map((virtualRow) => {
                            const task = tasks[virtualRow.index];

                            return (
                                <li
                                    key={task.id}
                                    data-index={virtualRow.index}
                                    ref={taskVirtualizer.measureElement}
                                    className="column__task"
                                    style={{
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}>
                                    <TaskCard onUpdateTask={onUpdateTask} task={task} />
                                </li>
                            );
                        })
                    )}
                </ul>
            </div>
        </section>
    );
};

export default Column;

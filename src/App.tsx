import './App.scss';
import { addTask, type Task } from './features/tasks/tasksSlice';
// import { useDispatch } from 'react-redux';
import { useAppDispatch } from './store/hooks';
import Board from './components/Board';

function App() {
    const dispatch = useAppDispatch();

    const task: Task = { id: 4, title: 't4', description: 't4 desc', status: 'done' };

    return (
        <div>
            Hello test
            <button onClick={() => dispatch(addTask(task))}></button>
            <Board />
        </div>
    );
}

export default App;

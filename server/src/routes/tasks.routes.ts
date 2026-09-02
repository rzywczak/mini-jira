import { Router } from 'express';
import { TaskModel } from '../models/task.model.js';

const tasksRouter = Router();

tasksRouter.get('/', async (_req, res) => {
    try {
        const tasks = await TaskModel.find().select('_id title description status').lean();
        const response = tasks.map((task) => ({
            id: task._id.toString(),
            title: task.title,
            description: task.description,
            status: task.status,
        }));

        res.status(200).json(response);
    } catch {
        res.status(500).json({ message: 'Failed to fetch tasks.' });
    }
});

export default tasksRouter;

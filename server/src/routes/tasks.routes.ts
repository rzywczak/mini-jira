import { Router } from 'express';
import mongoose from 'mongoose';
import { TaskModel } from '../models/task.model.js';

const tasksRouter = Router();
const TASK_STATUSES = ['todo', 'inProgress', 'done'] as const;
type TaskStatus = (typeof TASK_STATUSES)[number];

interface TaskResponseSource {
    _id: { toString(): string };
    title: string;
    description: string;
    status: string;
}

const serializeTask = (task: TaskResponseSource) => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
});

const isTaskStatus = (value: string): value is TaskStatus => TASK_STATUSES.some((status) => status === value);

tasksRouter.get('/', async (_req, res) => {
    try {
        const tasks = await TaskModel.find().select('_id title description status').lean();
        const response = tasks.map(serializeTask);

        res.status(200).json(response);
    } catch {
        res.status(500).json({ message: 'Failed to fetch tasks.' });
    }
});

tasksRouter.post('/', async (req, res) => {
    const body: unknown = req.body;

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        res.status(400).json({ message: 'Request body must be a JSON object.' });
        return;
    }

    const { title, description, status } = body as Record<string, unknown>;

    if (title === undefined) {
        res.status(400).json({ message: 'Title is required.' });
        return;
    }

    if (typeof title !== 'string') {
        res.status(400).json({ message: 'Title must be a string.' });
        return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
        res.status(400).json({ message: 'Title cannot be empty.' });
        return;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).json({ message: 'Description must be a string.' });
        return;
    }

    if (status !== undefined && (typeof status !== 'string' || !isTaskStatus(status))) {
        res.status(400).json({ message: 'Status must be one of: todo, inProgress, done.' });
        return;
    }

    const taskData: { title: string; description?: string; status?: TaskStatus } = {
        title: trimmedTitle,
    };

    if (description !== undefined) taskData.description = description;
    if (status !== undefined) taskData.status = status;

    try {
        const task = await TaskModel.create(taskData);

        res.status(201).json(serializeTask(task));
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ message: 'Invalid task data.' });
            return;
        }

        res.status(500).json({ message: 'Failed to create task.' });
    }
});

export default tasksRouter;

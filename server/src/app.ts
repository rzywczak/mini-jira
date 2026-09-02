import express from 'express';
import tasksRouter from './routes/tasks.routes.js';

const app = express();

app.use('/api/tasks', tasksRouter);

app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

export default app;

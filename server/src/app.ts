import express from 'express';
import type { ErrorRequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import tasksRouter from './routes/tasks.routes.js';
import { openApiDocument } from './docs/openapi.js';

const app = express();

app.use(express.json());
app.get('/api/docs.json', (_req, res) => {
    res.status(200).json(openApiDocument);
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use('/api/tasks', tasksRouter);

app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

const jsonErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
    if (error instanceof SyntaxError && 'status' in error && error.status === 400 && 'body' in error) {
        res.status(400).json({ message: 'Request body contains invalid JSON.' });
        return;
    }

    next(error);
};

app.use(jsonErrorHandler);

export default app;

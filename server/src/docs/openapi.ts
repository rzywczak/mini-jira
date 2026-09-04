export const openApiDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Mega Jira API',
        version: '1.0.0',
        description: 'REST API for managing tasks on the Mega Jira board.',
    },
    servers: [{ url: '/', description: 'Current server' }],
    tags: [
        { name: 'System', description: 'API availability' },
        { name: 'Tasks', description: 'Task management' },
    ],
    paths: {
        '/api/health': {
            get: {
                tags: ['System'],
                summary: 'Check API health',
                responses: {
                    '200': {
                        description: 'The API is running.',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Health' },
                                example: { status: 'ok' },
                            },
                        },
                    },
                },
            },
        },
        '/api/tasks': {
            get: {
                tags: ['Tasks'],
                summary: 'List all tasks',
                responses: {
                    '200': {
                        description: 'A list of tasks.',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Task' },
                                },
                            },
                        },
                    },
                    '500': { $ref: '#/components/responses/InternalServerError' },
                },
            },
            post: {
                tags: ['Tasks'],
                summary: 'Create a task',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/CreateTask' },
                            example: {
                                title: 'Prepare release',
                                description: 'Verify the production build.',
                                status: 'todo',
                            },
                        },
                    },
                },
                responses: {
                    '201': {
                        description: 'The created task.',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Task' },
                            },
                        },
                    },
                    '400': { $ref: '#/components/responses/BadRequest' },
                    '500': { $ref: '#/components/responses/InternalServerError' },
                },
            },
        },
        '/api/tasks/{id}': {
            patch: {
                tags: ['Tasks'],
                summary: 'Update a task',
                parameters: [{ $ref: '#/components/parameters/TaskId' }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/UpdateTask' },
                            example: { status: 'inProgress' },
                        },
                    },
                },
                responses: {
                    '200': {
                        description: 'The updated task.',
                        content: {
                            'application/json': {
                                schema: { $ref: '#/components/schemas/Task' },
                            },
                        },
                    },
                    '400': { $ref: '#/components/responses/BadRequest' },
                    '404': { $ref: '#/components/responses/NotFound' },
                    '500': { $ref: '#/components/responses/InternalServerError' },
                },
            },
            delete: {
                tags: ['Tasks'],
                summary: 'Delete a task',
                parameters: [{ $ref: '#/components/parameters/TaskId' }],
                responses: {
                    '204': { description: 'The task was deleted.' },
                    '400': { $ref: '#/components/responses/BadRequest' },
                    '404': { $ref: '#/components/responses/NotFound' },
                    '500': { $ref: '#/components/responses/InternalServerError' },
                },
            },
        },
    },
    components: {
        parameters: {
            TaskId: {
                name: 'id',
                in: 'path',
                required: true,
                description: 'MongoDB ObjectId of the task.',
                schema: {
                    type: 'string',
                    pattern: '^[a-fA-F0-9]{24}$',
                    example: '507f1f77bcf86cd799439011',
                },
            },
        },
        schemas: {
            TaskStatus: {
                type: 'string',
                enum: ['todo', 'inProgress', 'done'],
            },
            Task: {
                type: 'object',
                required: ['id', 'title', 'description', 'status'],
                properties: {
                    id: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    title: { type: 'string', example: 'Prepare release' },
                    description: { type: 'string', example: 'Verify the production build.' },
                    status: { $ref: '#/components/schemas/TaskStatus' },
                },
            },
            CreateTask: {
                type: 'object',
                required: ['title'],
                additionalProperties: false,
                properties: {
                    title: { type: 'string', minLength: 1 },
                    description: { type: 'string', default: '' },
                    status: { $ref: '#/components/schemas/TaskStatus' },
                },
            },
            UpdateTask: {
                type: 'object',
                minProperties: 1,
                additionalProperties: false,
                properties: {
                    title: { type: 'string', minLength: 1 },
                    description: { type: 'string' },
                    status: { $ref: '#/components/schemas/TaskStatus' },
                },
            },
            Health: {
                type: 'object',
                required: ['status'],
                properties: { status: { type: 'string', example: 'ok' } },
            },
            Error: {
                type: 'object',
                required: ['message'],
                properties: { message: { type: 'string' } },
            },
        },
        responses: {
            BadRequest: {
                description: 'The request is invalid.',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/Error' } },
                },
            },
            NotFound: {
                description: 'The task was not found.',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/Error' } },
                },
            },
            InternalServerError: {
                description: 'An unexpected server or database error occurred.',
                content: {
                    'application/json': { schema: { $ref: '#/components/schemas/Error' } },
                },
            },
        },
    },
} as const;

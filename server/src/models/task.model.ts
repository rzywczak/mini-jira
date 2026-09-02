import { model, Schema } from 'mongoose';

const taskSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: ['todo', 'inProgress', 'done'],
        default: 'todo',
    },
});

export const TaskModel = model('Task', taskSchema);

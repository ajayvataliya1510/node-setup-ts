import mongoose, { Schema, Document } from 'mongoose';

export enum TaskStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
}

export interface ITask extends Document {
    title: string;
    description: string;
    status: TaskStatus;
    userId: mongoose.Types.ObjectId;  // User who owns the task
}

const TaskSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: Object.values(TaskStatus), default: TaskStatus.PENDING },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

export default mongoose.model<ITask>('Task', TaskSchema);

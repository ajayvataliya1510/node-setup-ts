import Joi from 'joi';
import { TaskStatus } from '../models/Task';

export const createTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(5).max(500).required(),
    status: Joi.string().valid(...Object.values(TaskStatus)).optional()
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(5).max(500).optional(),
    status: Joi.string().valid(...Object.values(TaskStatus)).optional()
}).min(1); // At least one field must be provided

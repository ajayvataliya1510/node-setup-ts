import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UserRole } from '../models/User';

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.createTask(req.body, req.user!._id as unknown as string);
        res.status(201).json({ success: true, data: task });
    } catch (error) {
        next(error);
    }
};

export const getTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user!._id as unknown as string;
        const isAdmin = req.user!.role === UserRole.ADMIN;

        // Admins can see all tasks, users can only see their own
        const tasks = isAdmin
            ? await taskService.getAllTasks()
            : await taskService.getTasksByUser(userId);

        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        next(error);
    }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user!._id as unknown as string;
        const isAdmin = req.user!.role === UserRole.ADMIN;

        const task = await taskService.getTaskById(taskId, userId, isAdmin);
        res.status(200).json({ success: true, data: task });
    } catch (error: any) {
        if (error.message === 'Task not found') return res.status(404).json({ success: false, message: error.message });
        if (error.message === 'Not authorized to access this task') return res.status(403).json({ success: false, message: error.message });
        next(error);
    }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user!._id as unknown as string;
        const isAdmin = req.user!.role === UserRole.ADMIN;

        const updatedTask = await taskService.updateTask(taskId, userId, isAdmin, req.body);
        res.status(200).json({ success: true, data: updatedTask });
    } catch (error: any) {
        if (error.message === 'Task not found') return res.status(404).json({ success: false, message: error.message });
        if (error.message === 'Not authorized to access this task') return res.status(403).json({ success: false, message: error.message });
        next(error);
    }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const userId = req.user!._id as unknown as string;
        const isAdmin = req.user!.role === UserRole.ADMIN;

        await taskService.deleteTask(taskId, userId, isAdmin);
        res.status(200).json({ success: true, data: {} });
    } catch (error: any) {
        if (error.message === 'Task not found') return res.status(404).json({ success: false, message: error.message });
        if (error.message === 'Not authorized to access this task') return res.status(403).json({ success: false, message: error.message });
        next(error);
    }
};

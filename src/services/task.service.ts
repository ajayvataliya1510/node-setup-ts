import Task, { ITask } from '../models/Task';

export const createTask = async (taskData: Partial<ITask>, userId: string) => {
    return await Task.create({ ...taskData, userId });
};

export const getTasksByUser = async (userId: string) => {
    return await Task.find({ userId }).sort({ createdAt: -1 });
};

export const getAllTasks = async () => {
    return await Task.find().populate('userId', 'name email').sort({ createdAt: -1 });
};

export const getTaskById = async (taskId: string, userId: string, isAdmin: boolean) => {
    const task = await Task.findById(taskId);
    if (!task) throw new Error('Task not found');

    // If not admin and not the owner of the task, deny access
    if (!isAdmin && task.userId.toString() !== userId) {
        throw new Error('Not authorized to access this task');
    }
    return task;
};

export const updateTask = async (taskId: string, userId: string, isAdmin: boolean, updateData: Partial<ITask>) => {
    const task = await getTaskById(taskId, userId, isAdmin);
    Object.assign(task, updateData);
    return await task.save();
};

export const deleteTask = async (taskId: string, userId: string, isAdmin: boolean) => {
    const task = await getTaskById(taskId, userId, isAdmin);
    await Task.findByIdAndDelete(taskId);
    return task;
};

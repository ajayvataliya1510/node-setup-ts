import { Router } from 'express';
import { createTask, getTasks, getTaskById, updateTask, deleteTask } from '../controllers/task.controller';
import { validateRequest } from '../middlewares/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// All task routes require authentication
router.use(protect);

router.route('/')
    .post(validateRequest(createTaskSchema), createTask)
    .get(getTasks);

router.route('/:id')
    .get(getTaskById)
    .put(validateRequest(updateTaskSchema), updateTask)
    .delete(deleteTask);

export default router;

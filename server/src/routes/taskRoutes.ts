import { Router } from 'express';
import { createTask, deleteTask, listTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { taskSchema } from '../validations/taskValidation.js';

const router = Router();
router.use(protect);
router.route('/').get(listTasks).post(validate(taskSchema), createTask);
router.route('/:id').patch(updateTask).delete(deleteTask);
export default router;

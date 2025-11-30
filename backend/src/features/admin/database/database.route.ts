import { Router } from 'express';
import * as databaseController from './database.controller';

const router = Router();

router.get('/users', databaseController.getAllUsers);
router.patch('/users/:userId', databaseController.updateUser);
router.delete('/users/:userId', databaseController.deleteUser);

export default router;

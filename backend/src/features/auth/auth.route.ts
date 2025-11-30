import { Router } from 'express';
import { login, getUser } from './auth.controller';

const router = Router();

router.post('/login', login);
router.get('/:id', getUser);

export default router;

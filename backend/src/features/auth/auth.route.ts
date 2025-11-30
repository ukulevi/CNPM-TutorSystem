import { Router } from 'express';
import { login, getUser } from './auth.controller';

const router = Router();

router.post('/login', login);
router.get('/:id', getUser);

export default router;
//(NHI) auth route định nghĩa các endpoint liên quan đến xác thực, đăng nhập, lấy thông tin user
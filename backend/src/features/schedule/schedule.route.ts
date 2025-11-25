import { Router } from 'express';
import { getSchedule, getAppointments } from './schedule.controller';

const router = Router();

router.get('/', getSchedule);
router.get('/appointments', getAppointments); // Now uses the general getAppointments

export default router;

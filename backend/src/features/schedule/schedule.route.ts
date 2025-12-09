import { Router } from 'express';
import { getSchedule, getAppointments, createAppointment, cancelAppointment, updateAppointmentStatus, freeSlot, addAvailableSlot } from './schedule.controller';

const router = Router();

router.get('/', getSchedule);
router.get('/appointments', getAppointments); // Now uses the general getAppointments
router.post('/appointments', createAppointment);
router.patch('/appointments/:appointmentId', updateAppointmentStatus);
router.delete('/appointments/:appointmentId', cancelAppointment);
router.delete('/', freeSlot);
router.post('/', addAvailableSlot);

export default router;
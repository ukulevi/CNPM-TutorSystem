import { Router } from 'express';
import { getBookings, createBooking } from './booking.controller';

const router = Router();

router.get('/', getBookings);
router.post('/', createBooking);

export default router;

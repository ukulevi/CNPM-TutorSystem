import { Router } from 'express';
import { getBookings, createBooking, updateBooking, deleteBooking } from './booking.controller';

const router = Router();

router.get('/', getBookings);
router.post('/', createBooking);
router.patch('/:id', updateBooking);
router.delete('/:id', deleteBooking);

export default router;
import { Router } from 'express';
import { searchTutors, getDepartments, getTutors } from './search.controller';

const router = Router();

router.get('/', searchTutors);
router.get('/departments', getDepartments);
router.get('/tutors', getTutors);

export default router;

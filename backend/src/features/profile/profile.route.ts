import { Router } from 'express';
import { getProfile, getAllProfiles } from './profile.controller';

const router = Router();

console.log('Profile Router initialized (simplified).');

router.get('/', getAllProfiles);
router.get('/:id', getProfile);

export default router;

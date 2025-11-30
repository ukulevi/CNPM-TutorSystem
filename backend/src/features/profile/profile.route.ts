import { Router } from 'express';
import { getProfile, getAllProfiles, updateProfile, searchProfiles } from './profile.controller';
//(NHI) profile route định nghĩa các endpoint liên quan đến hồ sơ người dùng
const router = Router();

console.log('Profile Router initialized (simplified).');

router.get('/', getAllProfiles);
router.get('/search', searchProfiles); // Search by name/email
router.get('/:id', getProfile);
router.put('/:id', updateProfile); // Update profile

export default router;

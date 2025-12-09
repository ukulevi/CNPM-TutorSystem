import { Router } from 'express';
import * as analyticsController from './analytics.controller';

const router = Router();

router.get('/stats', analyticsController.getDashboardStats);
router.get('/academic-report', analyticsController.getAcademicReport);

export default router;

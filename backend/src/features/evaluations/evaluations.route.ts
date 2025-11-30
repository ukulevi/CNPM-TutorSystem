import { Router } from 'express';
import { getEvaluationsByTutor, getEvaluationById } from './evaluations.controller';

const router = Router();

router.get('/:id', getEvaluationById);

export default router;

import { Router } from 'express';
import { getEvaluationsByTutor, getEvaluationById, createEvaluation } from './evaluations.controller';

const router = Router();

router.get('/', getEvaluationsByTutor);
router.get('/:id', getEvaluationById);
router.post('/', createEvaluation);

export default router;

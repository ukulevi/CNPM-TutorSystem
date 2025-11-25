import { Router } from 'express';
import { getEvaluationsByTutor } from './evaluations.controller';

const router = Router();

router.get('/', getEvaluationsByTutor);

export default router;

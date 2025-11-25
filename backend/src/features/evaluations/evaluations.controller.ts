import { Request, Response } from 'express';
import { EvaluationsService } from './evaluations.service';

const evaluationsService = new EvaluationsService();

export const getEvaluationsByTutor = (req: Request, res: Response) => {
    const { tutorId } = req.query;

    if (!tutorId) {
        return res.status(400).json({ message: 'tutorId is required' });
    }

    try {
        const evaluations = evaluationsService.getEvaluationsByTutor(tutorId as string);
        if (evaluations) {
            return res.json(evaluations);
        }
        return res.status(404).json({ message: 'Evaluations not found for this tutor' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

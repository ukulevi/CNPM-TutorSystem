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
            console.log(evaluations);
            return res.status(200).json(evaluations);
        }
        return res.status(404).json({ message: 'Evaluations not found for this tutor' });
    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};

export const getEvaluationById = (req: Request, res: Response) => {
    const {evalId} = req.query;

    if (!evalId) {
         return res.status(400).json({ message: 'evalId is required' });
    }

    try {
        const evaluation = evaluationsService.getEvaluationById(evalId as string);
        if(!evaluation) {
            return res.status(404).json({message: 'No evaluation by this Id'});
        }

        return res.status(200).json(evaluation);
    }
    catch (error: any) {
        return res.status(500).json({ message: error.message }); 
    }
}

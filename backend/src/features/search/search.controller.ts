import { Request, Response } from 'express';
import { SearchService } from './search.service';

const searchService = new SearchService();

export const searchTutors = (req: Request, res: Response) => {
    const { q } = req.query;

    if (q) {
        const tutors = searchService.searchTutors(q as string);
        return res.json(tutors);
    }

    res.status(400).json({ message: 'q is required' });
};

export const getDepartments = (_req: Request, res: Response) => {
    try {
        const departments = searchService.getDepartments();
        res.json(departments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getTutors = (_req: Request, res: Response) => {
    try {
        const tutors = searchService.getTutors();
        res.json(tutors);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};


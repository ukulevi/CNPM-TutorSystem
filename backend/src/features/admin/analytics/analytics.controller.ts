import { Request, Response } from 'express';
import * as analyticsService from './analytics.service';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await analyticsService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard stats.' });
  }
};

export const getAcademicReport = async (req: Request, res: Response) => {
  try {
    const report = await analyticsService.getAcademicReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch academic report.' });
  }
};

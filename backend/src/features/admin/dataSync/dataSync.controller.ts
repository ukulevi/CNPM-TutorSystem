import { Request, Response } from 'express';
import * as dataSyncService from './dataSync.service';

export const getAllData = async (req: Request, res: Response) => {
    try {
        const data = await dataSyncService.getAllData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch data.' });
    }
};

export const exportData = async (req: Request, res: Response) => {
    try {
        const data = await dataSyncService.exportData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to export data.' });
    }
};

export const importData = async (req: Request, res: Response) => {
    try {
        const result = await dataSyncService.importData(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to import data.', error: error });
    }
};

export const backupDatabase = async (req: Request, res: Response) => {
    try {
        const result = await dataSyncService.backupDatabase();
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to backup database.' });
    }
};

export const getSyncStatus = async (req: Request, res: Response) => {
    try {
        const status = await dataSyncService.getSyncStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get sync status.' });
    }
};

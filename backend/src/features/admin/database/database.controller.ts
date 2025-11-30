import { Request, Response } from 'express';
import * as databaseService from './database.service';

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await databaseService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const userData = req.body;
        const updatedUser = await databaseService.updateUser(userId, userData);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user.' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        await databaseService.deleteUser(userId);
        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};

import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();

export const login = (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const user = authService.login(email);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};

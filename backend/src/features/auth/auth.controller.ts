import { Request, Response } from 'express';
import { AuthService } from './auth.service';

const authService = new AuthService();
//(NHI) controller xử lý request, response, gọi service để thao tác với dữ liệu
/**
 * Login endpoint
 * Accepts email or user ID
 * Returns user object if found, 401 otherwise
 */
export const login = (req: Request, res: Response) => {
    const { email, userId } = req.body;
    
    // Accept either email or userId
    const searchKey = email || userId;
    if (!searchKey) {
        return res.status(400).json({ message: 'Email or userId is required' });
    }

    const user = authService.login(searchKey);
    if (user) {
        // In production, create a real session token/JWT here
        // For now, just return the user object
        res.json({
            success: true,
            user,
            sessionId: user.id, // Simple session ID (in production, use JWT)
        });
    } else {
        res.status(401).json({ 
            success: false,
            message: 'Invalid credentials: user not found' 
        });
    }
};

/**
 * Get user by ID (optional endpoint for fetching user details)
 */
export const getUser = (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    const user = authService.getUserById(id);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

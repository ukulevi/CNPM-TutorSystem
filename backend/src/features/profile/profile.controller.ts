import { Request, Response } from 'express';
import { ProfileService } from './profile.service';

const profileService = new ProfileService();
//(NHI) controller xử lý request, response, gọi service để thao tác với dữ liệu
/**
 * Get profile by user ID
 */
export const getProfile = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const profile = profileService.getProfileById(id);
        console.log('Profile returned by service:', profile);
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error getting profile:', error);
        res.status(500).json({ message: 'Failed to fetch profile' });
    }
};

/**
 * Get all profiles
 */
export const getAllProfiles = (req: Request, res: Response) => {
    try {
        console.log('getAllProfiles function in controller hit.');
        const profiles = profileService.getAllProfiles();
        res.json(profiles);
    } catch (error) {
        console.error('Error getting all profiles:', error);
        res.status(500).json({ message: 'Failed to fetch profiles' });
    }
};

/**
 * Update user profile
 * Body: { name, email, avatar, ... }
 */
export const updateProfile = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No fields to update' });
        }

        const updated = profileService.updateProfile(id, updates);
        if (updated) {
            res.json({
                success: true,
                message: 'Profile updated successfully',
                profile: updated,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Profile not found'
            });
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

/**
 * Search profiles by name or email
 * Query params: ?q=searchQuery
 */
export const searchProfiles = (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string' || q.trim().length === 0) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const results = profileService.searchProfiles(q);
        res.json(results);
    } catch (error) {
        console.error('Error searching profiles:', error);
        res.status(500).json({ message: 'Failed to search profiles' });
    }
};

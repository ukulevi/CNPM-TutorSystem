import { Request, Response } from 'express';
import { ProfileService } from './profile.service';

const profileService = new ProfileService();

export const getProfile = (req: Request, res: Response) => {
    const { id } = req.params;
    const profile = profileService.getProfileById(id);
    console.log('Profile returned by service:', profile);
    if (profile) {
        res.json(profile);
    } else {
        res.status(404).json({ message: 'Profile not found' });
    }
};

export const getAllProfiles = (req: Request, res: Response) => {
    console.log('getAllProfiles function in controller hit.');
    const profiles = profileService.getAllProfiles();
    res.json(profiles);
};

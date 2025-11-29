import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

interface Profile {
    id: string;
    name: string;
    email: string;
    role: string;
    [key: string]: any;
}

interface Db {
    profiles: Profile[];
    [key: string]: any;
}

export class ProfileService {
    private readDb(): Db {
        try {
            const dbRaw = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(dbRaw);

            // Validate the structure
            if (!parsed.profiles || !Array.isArray(parsed.profiles)) {
                console.error('Invalid database structure: missing or invalid profiles array');
                throw new Error('Invalid database structure');
            }

            return parsed;
        } catch (error) {
            console.error('Error reading database:', error);
            throw error;
        }
    }

    private writeDb(db: Db): void {
        try {
            // Validate before writing
            if (!db.profiles || !Array.isArray(db.profiles)) {
                throw new Error('Invalid database structure: profiles must be an array');
            }

            // Write to a temporary file first, then rename (atomic operation)
            const tempPath = dbPath + '.tmp';

            // Ensure no stale temp file exists
            if (fs.existsSync(tempPath)) {
                try {
                    fs.unlinkSync(tempPath);
                } catch (e) {
                    console.warn('Could not delete existing temp file:', e);
                }
            }

            fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');

            // Atomic rename (will replace the original file)
            try {
                fs.renameSync(tempPath, dbPath);
            } catch (renameError) {
                // If rename fails, try direct write as fallback
                console.warn('Rename failed, falling back to direct write:', renameError);
                fs.unlinkSync(tempPath); // Clean up temp file
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
            }
        } catch (error) {
            console.error('Error writing database:', error);
            // Try to clean up temp file if it exists
            try {
                const tempPath = dbPath + '.tmp';
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            } catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
            throw error;
        }
    }

    /**
     * Get profile by user ID
     */
    getProfileById(userId: string): Profile | undefined {
        console.log('Searching for profile with userId:', userId);
        const db = this.readDb();
        const profile = db.profiles.find(profile => profile.id === userId);
        console.log('Found profile:', profile);
        return profile;
    }

    /**
     * Get all profiles
     */
    getAllProfiles(): Profile[] {
        const db = this.readDb();
        return db.profiles;
    }

    /**
     * Update user profile with new data
     */
    updateProfile(userId: string, updates: Partial<Profile>): Profile | undefined {
        const db = this.readDb();
        const profileIndex = db.profiles.findIndex(p => p.id === userId);

        if (profileIndex === -1) {
            console.error(`Profile with ID ${userId} not found`);
            return undefined;
        }

        // Merge updates with existing profile
        db.profiles[profileIndex] = {
            ...db.profiles[profileIndex],
            ...updates,
            id: userId, // Prevent ID from being changed
        };

        this.writeDb(db);
        console.log('Profile updated:', db.profiles[profileIndex]);
        return db.profiles[profileIndex];
    }

    /**
     * Search profiles by name or email (for user search feature)
     */
    searchProfiles(query: string): Profile[] {
        const db = this.readDb();
        const lowerQuery = query.toLowerCase();
        return db.profiles.filter(p =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.email.toLowerCase().includes(lowerQuery)
        );
    }
}

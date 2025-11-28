import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

interface Profile {
    id: string;
    name: string;
    email: string;
    // Add other profile properties here
}

interface Db {
    profiles: Profile[];
    // Add other db properties here
}

export class ProfileService {
    private readDb(): Db {
        console.log('Attempting to read DB from:', dbPath);
        const dbRaw = fs.readFileSync(dbPath);
        console.log('Raw DB content length:', dbRaw.length);
        const db = JSON.parse(dbRaw.toString());
        console.log('Parsed DB object (first 100 chars):', JSON.stringify(db).substring(0, 100));
        return db;
    }

    getProfileById(userId: string): Profile | undefined {
        console.log('Searching for profile with userId:', userId);
        const db = this.readDb();
        const profile = db.profiles.find(profile => profile.id === userId);
        console.log('Found profile:', profile);
        return profile;
    }

    getAllProfiles(): Profile[] {
        const db = this.readDb();
        return db.profiles;
    }
}

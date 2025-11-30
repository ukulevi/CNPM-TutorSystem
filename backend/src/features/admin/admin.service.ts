import fs from 'fs';
import path from 'path';
import { UserProfileData } from './admin.types';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

interface Db {
    users: any[];
}

const readDb = (): Db => {
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbRaw);
};

const writeDb = (db: any): void => {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
};

export const getAllUsers = async (): Promise<UserProfileData[]> => {
    const db = readDb();
    return db.users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role
    }));
};

export const updateUserRole = async (userId: string, newRole: UserProfileData['role']): Promise<UserProfileData> => {
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error('User not found');
    }

    // The frontend sends lowercase roles, but db.json uses lowercase, so no conversion needed.
    db.users[userIndex].role = newRole;
    writeDb(db);

    const updatedUser = db.users[userIndex];
    return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
    };
};
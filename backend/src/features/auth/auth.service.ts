import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

interface User {
    id: string;
    email: string;
    // Add other user properties here
}

interface Db {
    profiles: User[];
    // Add other db properties here
}

export class AuthService {
    private readDb(): Db {
        const dbRaw = fs.readFileSync(dbPath);
        return JSON.parse(dbRaw.toString());
    }

    login(email: string): User | undefined {
        const db = this.readDb();
        return db.profiles.find(user => user.email === email);
    }
}

import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

//(NHI) auth service xử lý logic liên quan đến xác thực, đăng nhập, lấy thông tin user
interface User {
    id: string;
    name: string;
    email: string;
    role: 'student' | 'tutor' | 'admin';
    avatar?: string;
    [key: string]: any;
}

interface Db {
    users: User[];
    [key: string]: any;
}

interface Session {
    userId: string;
    loginTime: string;
    expiresAt: string;
}

export class AuthService {
    private readDb(): Db {
        try {
            const dbRaw = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(dbRaw);

            // Validate the structure
            if (!parsed.users || !Array.isArray(parsed.users)) {
                console.error('Invalid database structure: missing or invalid users array');
                throw new Error('Invalid database structure');
            }

            return parsed;
        } catch (error) {
            console.error('Error reading database:', error);
            throw error;
        }
    }

    /**
     * Login by user ID (email-based in this simplified implementation)
     * Returns user object and saves session info
     */
    login(emailOrId: string): User | undefined {
        const db = this.readDb();
        // Try to find by email first, then by id
        return db.users.find(user => user.email === emailOrId || user.id === emailOrId);
    }

    /**
     * Get user by ID
     */
    getUserById(userId: string): User | undefined {
        const db = this.readDb();
        return db.users.find(user => user.id === userId);
    }
}

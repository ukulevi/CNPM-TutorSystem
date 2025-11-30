import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

interface Appointment {
    id: string;
    tutorId: string;
    studentId: string;
    status: string;
    // Add other appointment properties here
}

interface Department {
    id: string;
    name: string;
    // Add other department properties here
}

interface Tutor { // This is the detailed tutor profile, used by searchTutors and getTutors
    id: string;
    name: string;
    specialization: string;
    role: string;
    // Add other tutor properties here
}

interface Db {
    appointments: Appointment[];
    departments: Department[];
    users: Tutor[]; // The 'users' array contains both tutors and students
    // Add other db properties here
}

export class SearchService {
    private readDb(): Db {
        try {
            const dbRaw = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(dbRaw);

            // Provide default empty arrays if properties are missing
            parsed.appointments = parsed.appointments || [];
            parsed.departments = parsed.departments || [];
            parsed.users = parsed.users || [];

            return parsed;
        } catch (error) {
            console.error('Error reading database:', error);
            throw error;
        }
    }

    searchTutors(query: string): Tutor[] {
        const db = this.readDb();
        const lowerCaseQuery = query.toLowerCase();
        return db.users.filter(profile =>
            profile.role === 'tutor' &&
            (profile.name.toLowerCase().includes(lowerCaseQuery) ||
            profile.specialization.toLowerCase().includes(lowerCaseQuery))
        );
    }

    getDepartments(): Department[] {
        const db = this.readDb();
        return db.departments;
    }

    getTutors(): Tutor[] { // Now returns detailed Tutor profiles from the 'users' array
        const db = this.readDb();
        return db.users.filter(profile => profile.role === 'tutor');
    }
}

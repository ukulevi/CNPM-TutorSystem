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
    profiles: Tutor[]; // The 'profiles' array contains both tutors and students
    // Add other db properties here
}

export class SearchService {
    private readDb(): Db {
        const dbRaw = fs.readFileSync(dbPath);
        const db = JSON.parse(dbRaw.toString());
        // Provide default empty arrays if properties are missing
        db.appointments = db.appointments || [];
        db.departments = db.departments || [];
        db.profiles = db.profiles || [];
        return db;
    }

    searchTutors(query: string): Tutor[] {
        const db = this.readDb();
        const lowerCaseQuery = query.toLowerCase();
        return db.profiles.filter(profile =>
            profile.role === 'tutor' &&
            (profile.name.toLowerCase().includes(lowerCaseQuery) ||
             profile.specialization.toLowerCase().includes(lowerCaseQuery))
        );
    }

    getDepartments(): Department[] {
        const db = this.readDb();
        return db.departments;
    }

    getTutors(): Tutor[] { // Now returns detailed Tutor profiles from the 'profiles' array
        const db = this.readDb();
        return db.profiles.filter(profile => profile.role === 'tutor');
    }
}

import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

interface Schedule {
    // Define schedule properties here
}

interface Db {
    tutorSchedule: { [tutorId: string]: Schedule };
    // Add other db properties here
}

export class ScheduleService {
    private readDb(): Db {
        const dbRaw = fs.readFileSync(dbPath);
        return JSON.parse(dbRaw.toString());
    }

    getScheduleByTutor(tutorId: string): Schedule | undefined {
        const db = this.readDb();
        return db.tutorSchedule[tutorId];
    }
}

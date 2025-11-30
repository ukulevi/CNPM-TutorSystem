import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

interface ScheduleDay {
    // Define schedule properties here
    day: string,
    slots: string[]
}

type Schedule = ScheduleDay[];

interface Db {
    tutorSchedule: { [tutorId: string]: Schedule };
    // Add other db properties here
}

export class ScheduleService {
    private readDb(): Db {
        const dbRaw = fs.readFileSync(dbPath);
        return JSON.parse(dbRaw.toString());
    }

    private writeDb(db: Db): void {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }

    getScheduleByTutor(tutorId: string): Schedule | undefined {
        const db = this.readDb();
        return db.tutorSchedule[tutorId];
    }

    freeSlot(tutorId: string, day: string, hour: string) {
        const db = this.readDb();

        const tutorSchedule = db.tutorSchedule[tutorId];
        if (!tutorSchedule) {
            // Tutor schedule not found
            return false;
        }
        const targetDay = tutorSchedule.find(d => d.day === day);
        if (!targetDay) {
            // Day not found in schedule
            return false;
        }
        // const targetHour = targetDay?.slots.find(h => h.hour === hour);

        const initialSlotCount = targetDay.slots.length;

        const updatedSlots = targetDay.slots.filter(h => h !== hour);
        if (updatedSlots.length === initialSlotCount) {
            return false;
        }

        targetDay.slots = updatedSlots;

        this.writeDb(db);
        return true;
    };

    addAvailableSlot(tutorId: string, day: string, hour: string) {
        const db = this.readDb();
        const tutorSchedule = db.tutorSchedule[tutorId];
        console.log(tutorSchedule[0])
        if (!tutorSchedule) {
            // Tutor schedule not found
            return false;
        }
        const targetDay = tutorSchedule.find(d => d.day === day);
        if (!targetDay) {
            let newDay = {
                day: day,
                slots: [hour],
            }
            tutorSchedule.push(newDay);
        }
        else {
            targetDay.slots.push(hour);
        }

        this.writeDb(db);
        return true;
    }
}

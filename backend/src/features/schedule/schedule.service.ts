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
        try {
            const dbRaw = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(dbRaw);

            // Validate the structure
            if (!parsed.tutorSchedule || typeof parsed.tutorSchedule !== 'object') {
                console.error('Invalid database structure: missing or invalid tutorSchedule object');
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
            if (!db.tutorSchedule || typeof db.tutorSchedule !== 'object') {
                throw new Error('Invalid database structure: tutorSchedule must be an object');
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
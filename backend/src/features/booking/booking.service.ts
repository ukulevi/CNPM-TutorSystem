import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

interface Appointment {
    id: string;
    tutorId: string;
    studentId: string;
    status: string; // Ensure status is part of the interface
    // Add other appointment properties here
}

interface Db {
    appointments: Appointment[];
    // Add other db properties here
}

export class BookingService {
    private readDb(): Db { // (nhi) readDb có handle lỗi
        try {
            const dbRaw = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(dbRaw);

            // Validate the structure
            if (!parsed.appointments || !Array.isArray(parsed.appointments)) {
                console.error('Invalid database structure: missing or invalid appointments array');
                throw new Error('Invalid database structure');
            }

            return parsed;
        } catch (error) {
            console.error('Error reading database:', error);
            throw error;
        }
    }

    private writeDb(db: Db): void { //(nhi) writeDb có handle lỗi
        try {
            // Validate before writing
            if (!db.appointments || !Array.isArray(db.appointments)) {
                throw new Error('Invalid database structure: appointments must be an array');
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

    getAllAppointments(): Appointment[] {
        const db = this.readDb();
        return db.appointments;
    }

    getAppointmentsByTutor(tutorId: string, status?: string): Appointment[] {
        const db = this.readDb();
        let filteredAppointments = db.appointments.filter(apt => apt.tutorId === tutorId);
        if (status) {
            filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
        }
        console.log(`BookingService: Found ${filteredAppointments.length} appointments for tutorId: ${tutorId} with status: ${status || 'any'}`);
        return filteredAppointments;
    }

    getAppointmentsByStudent(studentId: string, status?: string): Appointment[] {
        const db = this.readDb();
        let filteredAppointments = db.appointments.filter(apt => apt.studentId === studentId);
        if (status) {
            filteredAppointments = filteredAppointments.filter(apt => apt.status === status);
        }
        console.log(`BookingService: Found ${filteredAppointments.length} appointments for studentId: ${studentId} with status: ${status || 'any'}`);
        return filteredAppointments;
    }

    createAppointment(appointment: Omit<Appointment, 'id'>): Appointment {
        const db = this.readDb();
        const newAppointment = { ...appointment, id: `apt-${Date.now()}` };
        db.appointments.push(newAppointment);
        this.writeDb(db);
        return newAppointment;
    }
    
    deleteAppointment(appointmentId: string): boolean {
        const db = this.readDb();
        const initialLength = db.appointments.length;

        const updatedAppointments = db.appointments.filter(apt => apt.id !== appointmentId);


        if (updatedAppointments.length === initialLength) {
            return false;
        }

        db.appointments = updatedAppointments;
        this.writeDb(db);
        return true;
    }
}


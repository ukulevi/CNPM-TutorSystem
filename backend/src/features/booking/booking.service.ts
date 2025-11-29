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
    private readDb(): Db {
        console.log('BookingService: Attempting to read DB from:', dbPath);
        const dbRaw = fs.readFileSync(dbPath);
        console.log('BookingService: Raw DB content length:', dbRaw.length);
        const db = JSON.parse(dbRaw.toString());
        console.log('BookingService: Parsed DB object (first 100 chars):', JSON.stringify(db).substring(0, 100));
        return db;
    }

    private writeDb(db: Db): void {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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

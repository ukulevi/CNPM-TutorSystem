import { Request, Response } from 'express';
import { ScheduleService } from './schedule.service';
import { BookingService } from '../booking/booking.service'; // Import BookingService
import { ProfileService } from '../profile/profile.service';

const scheduleService = new ScheduleService();
const bookingService = new BookingService(); // Instantiate BookingService
const profileService = new ProfileService();

export const getSchedule = (req: Request, res: Response) => {
    const { tutorId } = req.query;

    if (tutorId) {
        const schedule = scheduleService.getScheduleByTutor(tutorId as string);
        if (schedule) {
            return res.json(schedule);
        }
        return res.status(404).json({ message: 'Schedule not found' });
    }

    res.status(400).json({ message: 'tutorId is required' });
};

export const createAppointment = (req: Request, res: Response) => {
    const { tutorId, subject, date, time, type, status } = req.body;

    const studentId = 'student-1';

    try {
        const tutor = profileService.getProfileById(tutorId);
        const student = profileService.getProfileById(studentId);

        if (!tutor) {
            return res.status(404).json({ message: `Tutor with ID ${tutorId} not found.` });
        }
        if (!student) {
            return res.status(404).json({ message: `Student with ID ${studentId} not found.` });
        }

        const appointmentData = {
            tutorId: tutor.id,
            tutorName: tutor.name,
            studentId: 'placeholder',
            studentName: '',
            subject: subject,
            date: date, // Retrieved from req.body
            time: time, // Retrieved from req.body
            status: status, // Always 'booked' as requested
            type: type || 'online', // Use type from body/query or default
        };

        const newAppointment = bookingService.createAppointment(appointmentData);

        return res.status(201).json({
            message: 'Appointment created successfully.',
            appointment: newAppointment
        })
    }
    catch (err) {
        console.error('Error creating appointment:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const cancelAppointment = (req: Request, res: Response) => {
    const { appointmentId } = req.params;

    const result = bookingService.deleteAppointment(appointmentId);

    if (!result) {
        return res.status(500).json({
            message: `Failed to delete appointment ID: ${appointmentId}`
        });
    };

    return res.status(200).json({
        message: `Appointment ID: ${appointmentId} deleted successfully`
    });
}

export const freeSlot = (req: Request, res: Response) => {
    const { tutorId, day, hour } = req.query;

    if (typeof tutorId !== 'string' || typeof day !== 'string' || typeof hour !== 'string') {
        return res.status(400).json({
            message: "Missing or invalid parameters. Requires tutorId, day, and hour.",
            received: { tutorId, day, hour }
        });
    }

    const result = scheduleService.freeSlot(tutorId, day, hour);

    if (!result) {
        return res.status(500).json({
            message: `Failed to free slot ${hour} on ${day}`
        });
    };

    return res.status(200).json({
        message: `Slot ${hour} on ${day} freed successfully`
    });
}

export const addAvailableSlot = (req: Request, res: Response) => {
    const { tutorId, day, hour } = req.body;

    if (!tutorId || !day || !hour) {
        return res.status(400).json({
            message: "Missing parameters. Requires tutorId, day, and hour.",
            received: { tutorId, day, hour }
        });
    }

    const result = scheduleService.addAvailableSlot(tutorId as string, day as string, hour as string);

    if (!result) {
        return res.status(500).json({
            message: `Failed to set available slot ${hour} on ${day}`
        });
    };

    return res.status(200).json({
        message: `Slot ${hour} on ${day} is now available`
    });
}

export const getAppointments = (req: Request, res: Response) => {
    const { studentId, tutorId } = req.query;

    if (studentId) {
        const appointments = bookingService.getAppointmentsByStudent(studentId as string);
        if (appointments) {
            return res.json(appointments);
        }
        return res.status(404).json({ message: 'Appointments not found for this student' });
    } else if (tutorId) {
        const appointments = bookingService.getAppointmentsByTutor(tutorId as string);
        if (appointments) {
            return res.json(appointments);
        }
        return res.status(404).json({ message: 'Appointments not found for this tutor' });
    }

    res.status(400).json({ message: 'studentId or tutorId is required' });
};

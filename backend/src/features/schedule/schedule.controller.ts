import { Request, Response } from 'express';
import { ScheduleService } from './schedule.service';
import { BookingService } from '../booking/booking.service'; // Import BookingService

const scheduleService = new ScheduleService();
const bookingService = new BookingService(); // Instantiate BookingService

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

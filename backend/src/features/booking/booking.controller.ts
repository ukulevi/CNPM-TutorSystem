import { Request, Response } from 'express';
import { BookingService } from './booking.service';

const bookingService = new BookingService();

export const getBookings = (req: Request, res: Response) => {
    const { tutorId, studentId, status } = req.query;
    console.log('Bookings Controller: Received request with tutorId:', tutorId, 'studentId:', studentId, 'status:', status);

    let appointments;

    if (tutorId) {
        appointments = bookingService.getAppointmentsByTutor(tutorId as string, status as string);
    } else if (studentId) {
        appointments = bookingService.getAppointmentsByStudent(studentId as string, status as string);
    } else {
        appointments = bookingService.getAllAppointments();
    }

    console.log('Bookings Controller: Appointments returned by service:', appointments);
    res.json(appointments);
};

export const createBooking = (req: Request, res: Response) => {
    const newAppointment = req.body;
    if (!newAppointment) {
        return res.status(400).json({ message: 'Appointment data is required' });
    }
    const createdAppointment = bookingService.createAppointment(newAppointment);
    res.status(201).json(createdAppointment);
};

export const updateBooking = (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Appointment ID is required' });
    }

    if (!updates) {
        return res.status(400).json({ message: 'Update data is required' });
    }

    const updatedAppointment = bookingService.updateAppointment(id, updates);

    if (!updatedAppointment) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json(updatedAppointment);
};

export const deleteBooking = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Appointment ID is required' });
    }

    const success = bookingService.deleteAppointment(id);

    if (!success) {
        return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment deleted successfully' });
};
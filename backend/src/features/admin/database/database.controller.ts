import { Request, Response } from 'express';
import * as databaseService from './database.service';

// ===== USERS =====
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await databaseService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const userData = req.body;
        const updatedUser = await databaseService.updateUser(userId, userData);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user.' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const result = await databaseService.deleteUser(userId);
        res.json({ message: 'User deleted successfully.', ...result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user.' });
    }
};

// ===== APPOINTMENTS =====
export const getAllAppointments = async (req: Request, res: Response) => {
    try {
        const appointments = await databaseService.getAllAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointments.' });
    }
};

export const getAppointmentById = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.params;
        const appointment = await databaseService.getAppointmentById(appointmentId);
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch appointment.' });
    }
};

export const createAppointment = async (req: Request, res: Response) => {
    try {
        const appointmentData = req.body;
        const appointment = await databaseService.createAppointment(appointmentData);
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create appointment.' });
    }
};

export const updateAppointment = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.params;
        const appointmentData = req.body;
        const updatedAppointment = await databaseService.updateAppointment(appointmentId, appointmentData);
        res.json(updatedAppointment);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update appointment.' });
    }
};

export const deleteAppointment = async (req: Request, res: Response) => {
    try {
        const { appointmentId } = req.params;
        const result = await databaseService.deleteAppointment(appointmentId);
        res.json({ message: 'Appointment deleted successfully.', ...result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete appointment.' });
    }
};

// ===== DOCUMENTS =====
export const getAllDocuments = async (req: Request, res: Response) => {
    try {
        const documents = await databaseService.getAllDocuments();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch documents.' });
    }
};

export const getDocumentById = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;
        const document = await databaseService.getDocumentById(documentId);
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch document.' });
    }
};

export const createDocument = async (req: Request, res: Response) => {
    try {
        const documentData = req.body;
        const document = await databaseService.createDocument(documentData);
        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create document.' });
    }
};

export const updateDocument = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;
        const documentData = req.body;
        const updatedDocument = await databaseService.updateDocument(documentId, documentData);
        res.json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update document.' });
    }
};

export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { documentId } = req.params;
        const result = await databaseService.deleteDocument(documentId);
        res.json({ message: 'Document deleted successfully.', ...result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete document.' });
    }
};

// ===== EVALUATIONS =====
export const getAllEvaluations = async (req: Request, res: Response) => {
    try {
        const evaluations = await databaseService.getAllEvaluations();
        res.json(evaluations);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch evaluations.' });
    }
};

export const getEvaluationById = async (req: Request, res: Response) => {
    try {
        const { evaluationId } = req.params;
        const evaluation = await databaseService.getEvaluationById(evaluationId);
        res.json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch evaluation.' });
    }
};

export const createEvaluation = async (req: Request, res: Response) => {
    try {
        const evaluationData = req.body;
        const evaluation = await databaseService.createEvaluation(evaluationData);
        res.status(201).json(evaluation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create evaluation.' });
    }
};

export const updateEvaluation = async (req: Request, res: Response) => {
    try {
        const { evaluationId } = req.params;
        const evaluationData = req.body;
        const updatedEvaluation = await databaseService.updateEvaluation(evaluationId, evaluationData);
        res.json(updatedEvaluation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update evaluation.' });
    }
};

export const deleteEvaluation = async (req: Request, res: Response) => {
    try {
        const { evaluationId } = req.params;
        const result = await databaseService.deleteEvaluation(evaluationId);
        res.json({ message: 'Evaluation deleted successfully.', ...result });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete evaluation.' });
    }
};

// ===== STATISTICS =====
export const getDatabaseStats = async (req: Request, res: Response) => {
    try {
        const stats = await databaseService.getDatabaseStats();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch database statistics.' });
    }
};

// ===== BACKUP & RESTORE =====
export const getFullDatabase = async (req: Request, res: Response) => {
    try {
        const database = await databaseService.getFullDatabase();
        res.json(database);
    } catch (error) {
        res.status(500).json({ message: 'Failed to export database.' });
    }
};

export const restoreDatabase = async (req: Request, res: Response) => {
    try {
        const dbData = req.body;
        const result = await databaseService.restoreDatabase(dbData);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to restore database.' });
    }
};

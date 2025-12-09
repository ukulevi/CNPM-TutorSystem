import { Router } from 'express';
import * as databaseController from './database.controller';

const router = Router();

// ===== USERS ROUTES =====
router.get('/users', databaseController.getAllUsers);
router.patch('/users/:userId', databaseController.updateUser);
router.delete('/users/:userId', databaseController.deleteUser);

// ===== APPOINTMENTS ROUTES =====
router.get('/appointments', databaseController.getAllAppointments);
router.get('/appointments/:appointmentId', databaseController.getAppointmentById);
router.post('/appointments', databaseController.createAppointment);
router.patch('/appointments/:appointmentId', databaseController.updateAppointment);
router.delete('/appointments/:appointmentId', databaseController.deleteAppointment);

// ===== DOCUMENTS ROUTES =====
router.get('/documents', databaseController.getAllDocuments);
router.get('/documents/:documentId', databaseController.getDocumentById);
router.post('/documents', databaseController.createDocument);
router.patch('/documents/:documentId', databaseController.updateDocument);
router.delete('/documents/:documentId', databaseController.deleteDocument);

// ===== EVALUATIONS ROUTES =====
router.get('/evaluations', databaseController.getAllEvaluations);
router.get('/evaluations/:evaluationId', databaseController.getEvaluationById);
router.post('/evaluations', databaseController.createEvaluation);
router.patch('/evaluations/:evaluationId', databaseController.updateEvaluation);
router.delete('/evaluations/:evaluationId', databaseController.deleteEvaluation);

// ===== STATISTICS & BACKUP ROUTES =====
router.get('/stats', databaseController.getDatabaseStats);
router.get('/backup', databaseController.getFullDatabase);
router.post('/restore', databaseController.restoreDatabase);

export default router;

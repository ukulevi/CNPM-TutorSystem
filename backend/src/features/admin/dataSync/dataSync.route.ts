import { Router } from 'express';
import * as dataSyncController from './dataSync.controller';

const router = Router();

router.get('/data', dataSyncController.getAllData);
router.post('/export', dataSyncController.exportData);
router.post('/import', dataSyncController.importData);
router.post('/backup', dataSyncController.backupDatabase);
router.get('/status', dataSyncController.getSyncStatus);

export default router;

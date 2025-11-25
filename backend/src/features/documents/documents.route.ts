import { Router } from 'express';
import { getDocuments, createDocument } from './documents.controller';

const router = Router();

router.get('/', getDocuments);
router.post('/', createDocument);

export default router;

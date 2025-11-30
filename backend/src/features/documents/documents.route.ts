import { Router } from 'express';
import { getDocuments, uploadDocument, updateDocument, deleteDocument, togglePin } from './documents.controller';
//(NHI) documents route định nghĩa các endpoint liên quan đến tài liệu
const router = Router();

router.get('/', getDocuments); // Get documents (with optional userId query)
router.post('/', uploadDocument); // Upload/create new document
router.put('/:id', updateDocument); // Update document (visibility, pin status)
router.delete('/:id', deleteDocument); // Delete document
router.patch('/:id/toggle-pin', togglePin); // Toggle pin status

export default router;

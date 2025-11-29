import { Request, Response } from 'express';
import { DocumentService } from './documents.service';

const documentService = new DocumentService();
//(NHI) controller xử lý request, response, gọi service để thao tác với dữ liệu
/**
 * Get documents
 * Query params: ?userId=xxx (optional - if provided, returns documents for that user)
 */
export const getDocuments = (req: Request, res: Response) => {
    try {
        const { userId } = req.query;

        if (userId) {
            const documents = documentService.getDocumentsByUser(userId as string);
            return res.json(documents);
        }

        const documents = documentService.getAllDocuments();
        res.json(documents);
    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({ message: 'Failed to fetch documents' });
    }
};

/**
 * Upload/create a new document
 * Body: { name, userId, visibility, url?, type?, size? }
 */
export const uploadDocument = (req: Request, res: Response) => {
    try {
        const { name, userId, visibility } = req.body;

        if (!name || !userId || !visibility) {
            return res.status(400).json({
                message: 'Document name, userId, and visibility are required'
            });
        }

        const newDocument = documentService.createDocument({
            name,
            userId,
            visibility,
            url: req.body.url || '#', // Default URL placeholder
            type: req.body.type || 'file',
            size: req.body.size || 'unknown',
        });

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            document: newDocument,
        });
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ message: 'Failed to upload document' });
    }
};

/**
 * Update document visibility or pin status
 * Body: { visibility?, pinned? }
 */
export const updateDocument = (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { visibility, pinned } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'Document ID is required' });
        }

        const updates: any = {};
        if (visibility) updates.visibility = visibility;
        if (pinned !== undefined) updates.pinned = pinned;

        const updated = documentService.updateDocument(id, updates);
        if (updated) {
            res.json({
                success: true,
                message: 'Document updated successfully',
                document: updated,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }
    } catch (error) {
        console.error('Update document error:', error);
        res.status(500).json({ message: 'Failed to update document' });
    }
};

/**
 * Delete a document
 */
export const deleteDocument = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Document ID is required' });
        }

        const deleted = documentService.deleteDocument(id);
        if (deleted) {
            res.json({
                success: true,
                message: 'Document deleted successfully',
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ message: 'Failed to delete document' });
    }
};

/**
 * Toggle document pin status
 */
export const togglePin = (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Document ID is required' });
        }

        const updated = documentService.togglePinDocument(id);
        if (updated) {
            res.json({
                success: true,
                message: 'Document pin status toggled',
                document: updated,
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }
    } catch (error) {
        console.error('Toggle pin error:', error);
        res.status(500).json({ message: 'Failed to toggle pin' });
    }
};

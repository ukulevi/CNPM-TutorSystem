import { Request, Response } from 'express';
import { DocumentService } from './documents.service';

const documentService = new DocumentService();

export const getDocuments = (req: Request, res: Response) => {
    const { userId } = req.query;

    if (userId) {
        const documents = documentService.getDocumentsByUser(userId as string);
        return res.json(documents);
    }

    const documents = documentService.getAllDocuments();
    res.json(documents);
};

export const createDocument = (req: Request, res: Response) => {
    const newDocument = req.body;
    if (!newDocument) {
        return res.status(400).json({ message: 'Document data is required' });
    }
    const createdDocument = documentService.createDocument(newDocument);
    res.status(201).json(createdDocument);
};

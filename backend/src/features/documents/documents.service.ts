import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');
//(NHI) documents service xử lý trên database liên quan đến tài liệu
interface Document {
    id: string;
    userId: string;
    name: string;
    url?: string;
    size?: string;
    uploadDate?: string;
    type?: string;
    visibility: 'public' | 'private';
    pinned?: boolean;
}

interface Db {
    documents: Document[];
    [key: string]: any;
}

export class DocumentService {
    private readDb(): Db {
        try {
            const dbRaw = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(dbRaw);

            // Validate the structure
            if (!parsed.documents || !Array.isArray(parsed.documents)) {
                console.error('Invalid database structure: missing or invalid documents array');
                throw new Error('Invalid database structure');
            }

            return parsed;
        } catch (error) {
            console.error('Error reading database:', error);
            throw error;
        }
    }

    private writeDb(db: Db): void {
        try {
            // Validate before writing
            if (!db.documents || !Array.isArray(db.documents)) {
                throw new Error('Invalid database structure: documents must be an array');
            }

            // Write to a temporary file first, then rename (atomic operation)
            const tempPath = dbPath + '.tmp';

            // Ensure no stale temp file exists
            if (fs.existsSync(tempPath)) {
                try {
                    fs.unlinkSync(tempPath);
                } catch (e) {
                    console.warn('Could not delete existing temp file:', e);
                }
            }

            fs.writeFileSync(tempPath, JSON.stringify(db, null, 2), 'utf8');

            // Atomic rename (will replace the original file)
            try {
                fs.renameSync(tempPath, dbPath);
            } catch (renameError) {
                // If rename fails, try direct write as fallback
                console.warn('Rename failed, falling back to direct write:', renameError);
                fs.unlinkSync(tempPath); // Clean up temp file
                fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
            }
        } catch (error) {
            console.error('Error writing database:', error);
            // Try to clean up temp file if it exists
            try {
                const tempPath = dbPath + '.tmp';
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            } catch (cleanupError) {
                console.error('Error cleaning up temp file:', cleanupError);
            }
            throw error;
        }
    }

    /**
     * Get all documents
     */
    getAllDocuments(): Document[] {
        const db = this.readDb();
        return db.documents;
    }

    /**
     * Get documents by user ID
     */
    getDocumentsByUser(userId: string): Document[] {
        const db = this.readDb();
        return db.documents.filter(doc => doc.userId === userId);
    }

    /**
     * Create a new document
     */
    createDocument(document: Omit<Document, 'id'>): Document {
        const db = this.readDb();
        const newDocument: Document = {
            ...document,
            id: `doc-${Date.now()}`,
            uploadDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        };
        db.documents.push(newDocument);
        this.writeDb(db);
        return newDocument;
    }

    /**
     * Update document (e.g., change visibility, pin status)
     */
    updateDocument(docId: string, updates: Partial<Document>): Document | undefined {
        const db = this.readDb();
        const docIndex = db.documents.findIndex(d => d.id === docId);

        if (docIndex === -1) {
            return undefined;
        }

        db.documents[docIndex] = {
            ...db.documents[docIndex],
            ...updates,
            id: docId, // Prevent ID change
        };

        this.writeDb(db);
        return db.documents[docIndex];
    }

    /**
     * Delete a document
     */
    deleteDocument(docId: string): boolean {
        const db = this.readDb();
        const initialLength = db.documents.length;
        db.documents = db.documents.filter(d => d.id !== docId);

        if (db.documents.length < initialLength) {
            this.writeDb(db);
            return true;
        }
        return false;
    }

    /**
     * Toggle document pin status
     */
    togglePinDocument(docId: string): Document | undefined {
        const db = this.readDb();
        const docIndex = db.documents.findIndex(d => d.id === docId);

        if (docIndex === -1) {
            return undefined;
        }

        // Toggle the pinned status directly in the read data
        const doc = db.documents[docIndex];
        doc.pinned = !doc.pinned;

        // Write the updated database back
        this.writeDb(db);

        return doc;
    }

    /**
     * Get single document by ID
     */
    getDocumentById(docId: string): Document | undefined {
        const db = this.readDb();
        return db.documents.find(d => d.id === docId);
    }
}

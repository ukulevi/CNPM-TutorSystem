import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

interface Document {
    id: string;
    userId: string;
    // Add other document properties here
}

interface Db {
    documents: Document[];
    // Add other db properties here
}

export class DocumentService {
    private readDb(): Db {
        const dbRaw = fs.readFileSync(dbPath);
        return JSON.parse(dbRaw.toString());
    }

    private writeDb(db: Db): void {
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    }

    getAllDocuments(): Document[] {
        const db = this.readDb();
        return db.documents;
    }

    getDocumentsByUser(userId: string): Document[] {
        const db = this.readDb();
        return db.documents.filter(doc => doc.userId === userId);
    }

    createDocument(document: Omit<Document, 'id'>): Document {
        const db = this.readDb();
        const newDocument = { ...document, id: `doc-${Date.now()}` };
        db.documents.push(newDocument);
        this.writeDb(db);
        return newDocument;
    }
}

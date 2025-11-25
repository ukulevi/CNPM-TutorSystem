import fs from 'fs';
import path from 'path';

const dbPath = path.resolve(__dirname, '../../../db/db.json');

interface Evaluation {
    id: string;
    tutorId: string;
    studentId: string;
    rating: number;
    comment: string;
    // Add other evaluation properties here
}

interface Db {
    evaluations: Evaluation[];
    // Add other db properties here
}

export class EvaluationsService {
    private readDb(): Db {
        const dbRaw = fs.readFileSync(dbPath);
        const db = JSON.parse(dbRaw.toString());
        db.evaluations = db.evaluations || []; // Ensure evaluations array exists
        return db;
    }

    getEvaluationsByTutor(tutorId: string): Evaluation[] {
        const db = this.readDb();
        const formattedTutorId = tutorId.startsWith('tutor-') ? tutorId : `tutor-${tutorId}`;
        return db.evaluations.filter(evaluation => evaluation.tutorId === formattedTutorId);
    }
}

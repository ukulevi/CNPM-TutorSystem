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

export class EvaluationsService { //(nhi) handle đọc ghi evaluations
    private readDb(): Db {
        try {
            const dbRaw = fs.readFileSync(dbPath, 'utf8');
            const parsed = JSON.parse(dbRaw);

            // Ensure evaluations array exists
            parsed.evaluations = parsed.evaluations || [];

            return parsed;
        } catch (error) {
            console.error('Error reading database:', error);
            throw error;
        }
    }

    getEvaluationsByTutor(tutorId: string): Evaluation[] {
        const db = this.readDb();
        const formattedTutorId = tutorId.startsWith('tutor-') ? tutorId : `tutor-${tutorId}`;
        return db.evaluations.filter(evaluation => evaluation.tutorId === formattedTutorId);
    }
}

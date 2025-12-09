const API_URL = 'http://localhost:3001/api';

export interface EvaluationData {
    sessionId: string;
    tutorId: string;
    studentId: string;
    rating: number;
    comment: string;
}

/**
 * Tạo đánh giá mới cho buổi hẹn
 */
export const createEvaluation = async (evaluationData: EvaluationData): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/evaluations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evaluationData),
        });

        if (!response.ok) {
            throw new Error('Failed to create evaluation');
        }

        const result = await response.json();
        console.log('Evaluation created:', result);
        return result;
    } catch (error) {
        console.error('Error creating evaluation:', error);
        throw error;
    }
};

/**
 * Lấy đánh giá theo tutor ID
 */
export const getEvaluationsByTutor = async (tutorId: string): Promise<any[]> => {
    try {
        const response = await fetch(`${API_URL}/evaluations?tutorId=${tutorId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch evaluations');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching evaluations:', error);
        throw error;
    }
};

/**
 * Lấy đánh giá theo ID
 */
export const getEvaluationById = async (evalId: string): Promise<any> => {
    try {
        const response = await fetch(`${API_URL}/evaluations/${evalId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch evaluation');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching evaluation:', error);
        throw error;
    }
};

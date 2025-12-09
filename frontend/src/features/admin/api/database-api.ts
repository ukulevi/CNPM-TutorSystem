/**
 * Database Management API Client
 * Provides functions to interact with backend database endpoints
 */

const API_BASE_URL = 'http://localhost:3001/api/admin/database';

// ===== USERS API =====
export const usersApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    },

    update: async (userId: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    },

    delete: async (userId: string) => {
        const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
        return response.json();
    },
};

// ===== APPOINTMENTS API =====
export const appointmentsApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/appointments`);
        if (!response.ok) throw new Error('Failed to fetch appointments');
        return response.json();
    },

    getById: async (appointmentId: string) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`);
        if (!response.ok) throw new Error('Failed to fetch appointment');
        return response.json();
    },

    create: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/appointments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create appointment');
        return response.json();
    },

    update: async (appointmentId: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update appointment');
        return response.json();
    },

    delete: async (appointmentId: string) => {
        const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete appointment');
        return response.json();
    },
};

// ===== DOCUMENTS API =====
export const documentsApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/documents`);
        if (!response.ok) throw new Error('Failed to fetch documents');
        return response.json();
    },

    getById: async (documentId: string) => {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}`);
        if (!response.ok) throw new Error('Failed to fetch document');
        return response.json();
    },

    create: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/documents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create document');
        return response.json();
    },

    update: async (documentId: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update document');
        return response.json();
    },

    delete: async (documentId: string) => {
        const response = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete document');
        return response.json();
    },
};

// ===== EVALUATIONS API =====
export const evaluationsApi = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/evaluations`);
        if (!response.ok) throw new Error('Failed to fetch evaluations');
        return response.json();
    },

    getById: async (evaluationId: string) => {
        const response = await fetch(`${API_BASE_URL}/evaluations/${evaluationId}`);
        if (!response.ok) throw new Error('Failed to fetch evaluation');
        return response.json();
    },

    create: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/evaluations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to create evaluation');
        return response.json();
    },

    update: async (evaluationId: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}/evaluations/${evaluationId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update evaluation');
        return response.json();
    },

    delete: async (evaluationId: string) => {
        const response = await fetch(`${API_BASE_URL}/evaluations/${evaluationId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete evaluation');
        return response.json();
    },
};

// ===== STATISTICS API =====
export const statsApi = {
    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/stats`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    },
};

// ===== BACKUP & RESTORE API =====
export const backupApi = {
    backup: async () => {
        const response = await fetch(`${API_BASE_URL}/backup`);
        if (!response.ok) throw new Error('Failed to backup database');
        return response.json();
    },

    restore: async (dbData: any) => {
        const response = await fetch(`${API_BASE_URL}/restore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dbData),
        });
        if (!response.ok) throw new Error('Failed to restore database');
        return response.json();
    },
};


const API_URL = 'http://localhost:3001/api/admin/sync';

export interface SyncStatus {
    lastSyncTime: string;
    collections: {
        [key: string]: {
            count: number;
            type: string;
        };
    };
}

/**
 * Get all data from the database
 */
export const getAllData = async () => {
    try {
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) throw new Error('Failed to fetch data');
        return await response.json();
    } catch (error) {
        console.error('Error fetching all data:', error);
        throw error;
    }
};

/**
 * Export database as JSON
 */
export const exportData = async () => {
    try {
        const response = await fetch(`${API_URL}/export`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to export data');
        return await response.json();
    } catch (error) {
        console.error('Error exporting data:', error);
        throw error;
    }
};

/**
 * Import/sync data from external source
 */
export const importData = async (data: any) => {
    try {
        const response = await fetch(`${API_URL}/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to import data');
        return await response.json();
    } catch (error) {
        console.error('Error importing data:', error);
        throw error;
    }
};

/**
 * Backup the current database
 */
export const backupDatabase = async () => {
    try {
        const response = await fetch(`${API_URL}/backup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to backup database');
        return await response.json();
    } catch (error) {
        console.error('Error backing up database:', error);
        throw error;
    }
};

/**
 * Get sync status and statistics
 */
export const getSyncStatus = async (): Promise<SyncStatus> => {
    try {
        const response = await fetch(`${API_URL}/status`);
        if (!response.ok) throw new Error('Failed to fetch sync status');
        return await response.json();
    } catch (error) {
        console.error('Error fetching sync status:', error);
        throw error;
    }
};

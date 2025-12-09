import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

interface Db {
    [key: string]: any[];
}

const readDb = (): Db => {
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbRaw);
};

const writeDb = (db: any): void => {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
};

/**
 * Get all data from the database
 */
export const getAllData = async () => {
    return readDb();
};

/**
 * Export database as JSON file content
 */
export const exportData = async () => {
    const db = readDb();
    return {
        timestamp: new Date().toISOString(),
        data: db
    };
};

/**
 * Import/sync data from an external source
 */
export const importData = async (data: any) => {
    try {
        // Validate data structure
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data format');
        }

        const currentDb = readDb();
        
        // Merge with existing data (avoiding data loss)
        const mergedDb = {
            ...currentDb,
            ...data
        };

        writeDb(mergedDb);
        
        return {
            success: true,
            message: 'Data imported successfully',
            recordsImported: Object.keys(data).reduce((sum, key) => {
                return sum + (Array.isArray(data[key]) ? data[key].length : 0);
            }, 0)
        };
    } catch (error) {
        throw new Error(`Failed to import data: ${error}`);
    }
};

/**
 * Backup current database
 */
export const backupDatabase = async () => {
    try {
        const db = readDb();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(process.cwd(), 'db', `backup_${timestamp}.json`);
        
        fs.writeFileSync(backupPath, JSON.stringify(db, null, 2), 'utf8');
        
        return {
            success: true,
            message: 'Database backup created successfully',
            backupPath: backupPath
        };
    } catch (error) {
        throw new Error(`Failed to backup database: ${error}`);
    }
};

/**
 * Get sync status and statistics
 */
export const getSyncStatus = async () => {
    try {
        const db = readDb();
        const stats = {
            lastSyncTime: new Date().toISOString(),
            collections: {} as any
        };

        // Count records in each collection
        Object.keys(db).forEach(collectionName => {
            const collection = db[collectionName];
            if (Array.isArray(collection)) {
                stats.collections[collectionName] = {
                    count: collection.length,
                    type: 'array'
                };
            }
        });

        return stats;
    } catch (error) {
        throw new Error(`Failed to get sync status: ${error}`);
    }
};

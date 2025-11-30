/**
 * Simple database lock to prevent concurrent reads/writes
 * Uses a promise queue to serialize database operations
 */

let isLocked = false;
let waitQueue: (() => void)[] = [];

export async function acquireDbLock(): Promise<() => void> {
    return new Promise(resolve => {
        if (!isLocked) {
            isLocked = true;
            resolve(() => releaseDbLock());
        } else {
            waitQueue.push(() => {
                resolve(() => releaseDbLock());
            });
        }
    });
}

function releaseDbLock(): void {
    if (waitQueue.length > 0) {
        const nextWaiter = waitQueue.shift();
        if (nextWaiter) {
            isLocked = true; // Keep lock for next operation
            nextWaiter();
        }
    } else {
        isLocked = false;
    }
}

/**
 * Wrap a database operation with automatic locking
 */
export async function withDbLock<T>(operation: () => T): Promise<T> {
    const release = await acquireDbLock();
    try {
        return operation();
    } finally {
        release();
    }
}
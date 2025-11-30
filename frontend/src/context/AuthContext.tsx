import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProfileById, getAllProfiles, updateProfile as apiUpdateProfile } from '../features/profile/api/profileApi';
import { getDocuments as apiGetDocuments, uploadDocument as apiUploadDocument } from '../features/documents/api/documentApi';

type User = any;

type AuthContextType = {
    currentUser: User | null;
    loginAsTutor: () => Promise<User | null>;
    loginAsAdmin: () => Promise<User | null>;
    loginAsStudent: () => Promise<User | null>;
    logout: () => void;
    refreshProfile: () => Promise<User | null>;
    updateProfile: (payload: Partial<User>) => Promise<User | null>;
    getDocuments: (userId: string) => Promise<any[]>;
    uploadDocument: (file: File, visibility: 'public' | 'private', userId: string) => Promise<any>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'sessionUserId';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const id = localStorage.getItem(SESSION_KEY);
        if (id) {
            getProfileById(id)
                .then(user => setCurrentUser(user || null))
                .catch(err => {
                    console.error('Failed to load profile:', err);
                    setError('Failed to load profile');
                });
        }
    }, []);

    const loginById = async (id: string) => {
        try {
            localStorage.setItem(SESSION_KEY, id);
            const user = await getProfileById(id);
            setCurrentUser(user || null);
            setError(null);
            return user || null;
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed');
            return null;
        }
    };

    const loginAsTutor = async () => {
        // default tutor id from backend db
        return loginById('tutor-1');
    };

    const loginAsAdmin = async () => {
        // try to load an admin profile; if none, create a mock admin
        const id = 'admin-1';
        try {
            const user = await getProfileById(id);
            if (user) return loginById(id);
            const mockAdmin = {
                id,
                name: 'System Admin',
                email: 'admin@example.com',
                role: 'admin',
                avatar: '',
            } as User;
            localStorage.setItem(SESSION_KEY, id);
            setCurrentUser(mockAdmin);
            return mockAdmin;
        } catch (err) {
            console.error('Admin login error:', err);
            return null;
        }
    };

    const loginAsStudent = async () => {
        return loginById('student-1');
    };

    const logout = () => {
        localStorage.removeItem(SESSION_KEY);
        setCurrentUser(null);
        setError(null);
    };

    const refreshProfile = async () => {
        const id = localStorage.getItem(SESSION_KEY);
        if (!id) return null;
        try {
            const user = await getProfileById(id);
            setCurrentUser(user || null);
            return user || null;
        } catch (err) {
            console.error('Refresh error:', err);
            return null;
        }
    };

    const updateProfile = async (payload: Partial<User>) => {
        const id = localStorage.getItem(SESSION_KEY);
        if (!id) return null;
        try {
            const updated = await apiUpdateProfile(id, payload);
            setCurrentUser(updated || null);
            return updated || null;
        } catch (err) {
            console.error('Update error:', err);
            return null;
        }
    };

    const getDocuments = (userId: string) => apiGetDocuments(userId).catch(() => []);

    const uploadDocument = (file: File, visibility: 'public' | 'private', userId: string) =>
        apiUploadDocument(file, visibility, userId).catch(() => null);

    return (
        <AuthContext.Provider value={{ currentUser, loginAsTutor, loginAsAdmin, loginAsStudent, logout, refreshProfile, updateProfile, getDocuments, uploadDocument }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        // Return a dummy context instead of throwing
        return {
            currentUser: null,
            loginAsTutor: async () => null,
            loginAsAdmin: async () => null,
            loginAsStudent: async () => null,
            logout: () => {},
            refreshProfile: async () => null,
            updateProfile: async () => null,
            getDocuments: async () => [],
            uploadDocument: async () => null,
        };
    }
    return ctx;
};

export default AuthContext;

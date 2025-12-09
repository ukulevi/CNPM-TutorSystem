import path from 'path';
import fs from 'fs/promises';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  avatar?: string;
  department?: string;
  specialization?: string;
  rating?: number;
  departmentId?: string;
}

interface Appointment {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  uploadDate: string;
  fileSize: number;
  status: 'active' | 'archived' | 'deleted';
  description?: string;
}

interface Evaluation {
  id: string;
  tutorId: string;
  studentId: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

interface SystemSettings {
  [key: string]: any;
}

interface Db {
  users: User[];
  appointments: Appointment[];
  documents: Document[];
  evaluations: Evaluation[];
  systemSettings: SystemSettings[];
}

async function readDb(): Promise<Db> {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}


// ===== USER MANAGEMENT =====
export const getAllUsers = async () => {
  const db = await readDb();
  return db.users;
};

export const updateUser = async (userId: string, userData: any) => {
  const db = await readDb();
  let updatedUser = null;

  db.users = db.users.map(user => {
    if (user.id === userId) {
      updatedUser = { ...user, ...userData };
      return updatedUser;
    }
    return user;
  });

  await writeDb(db);
  return updatedUser;
};

export const deleteUser = async (userId: string) => {
  const db = await readDb();
  const initialUserCount = db.users.length;

  db.users = db.users.filter(user => user.id !== userId);

  await writeDb(db);
  return { count: initialUserCount - db.users.length };
};

// ===== APPOINTMENTS/BOOKINGS MANAGEMENT =====
export const getAllAppointments = async () => {
  const db = await readDb();
  return db.appointments || [];
};

export const getAppointmentById = async (appointmentId: string) => {
  const db = await readDb();
  return (db.appointments || []).find(apt => apt.id === appointmentId);
};

export const createAppointment = async (appointmentData: Appointment) => {
  const db = await readDb();
  if (!db.appointments) db.appointments = [];
  
  db.appointments.push(appointmentData);
  await writeDb(db);
  return appointmentData;
};

export const updateAppointment = async (appointmentId: string, appointmentData: any) => {
  const db = await readDb();
  if (!db.appointments) db.appointments = [];
  
  let updatedAppointment = null;
  db.appointments = db.appointments.map(apt => {
    if (apt.id === appointmentId) {
      updatedAppointment = { ...apt, ...appointmentData };
      return updatedAppointment;
    }
    return apt;
  });

  await writeDb(db);
  return updatedAppointment;
};

export const deleteAppointment = async (appointmentId: string) => {
  const db = await readDb();
  if (!db.appointments) db.appointments = [];
  
  const initialCount = db.appointments.length;
  db.appointments = db.appointments.filter(apt => apt.id !== appointmentId);

  await writeDb(db);
  return { count: initialCount - db.appointments.length };
};

// ===== DOCUMENTS MANAGEMENT =====
export const getAllDocuments = async () => {
  const db = await readDb();
  return db.documents || [];
};

export const getDocumentById = async (documentId: string) => {
  const db = await readDb();
  return (db.documents || []).find(doc => doc.id === documentId);
};

export const createDocument = async (documentData: Document) => {
  const db = await readDb();
  if (!db.documents) db.documents = [];
  
  db.documents.push(documentData);
  await writeDb(db);
  return documentData;
};

export const updateDocument = async (documentId: string, documentData: any) => {
  const db = await readDb();
  if (!db.documents) db.documents = [];
  
  let updatedDocument = null;
  db.documents = db.documents.map(doc => {
    if (doc.id === documentId) {
      updatedDocument = { ...doc, ...documentData };
      return updatedDocument;
    }
    return doc;
  });

  await writeDb(db);
  return updatedDocument;
};

export const deleteDocument = async (documentId: string) => {
  const db = await readDb();
  if (!db.documents) db.documents = [];
  
  const initialCount = db.documents.length;
  db.documents = db.documents.filter(doc => doc.id !== documentId);

  await writeDb(db);
  return { count: initialCount - db.documents.length };
};

// ===== EVALUATIONS MANAGEMENT =====
export const getAllEvaluations = async () => {
  const db = await readDb();
  return db.evaluations || [];
};

export const getEvaluationById = async (evaluationId: string) => {
  const db = await readDb();
  return (db.evaluations || []).find(evaluation => evaluation.id === evaluationId);
};

export const createEvaluation = async (evaluationData: Evaluation) => {
  const db = await readDb();
  if (!db.evaluations) db.evaluations = [];
  
  db.evaluations.push(evaluationData);
  await writeDb(db);
  return evaluationData;
};

export const updateEvaluation = async (evaluationId: string, evaluationData: any) => {
  const db = await readDb();
  if (!db.evaluations) db.evaluations = [];
  
  let updatedEvaluation = null;
  db.evaluations = db.evaluations.map(evaluation => {
    if (evaluation.id === evaluationId) {
      updatedEvaluation = { ...evaluation, ...evaluationData };
      return updatedEvaluation;
    }
    return evaluation;
  });

  await writeDb(db);
  return updatedEvaluation;
};

export const deleteEvaluation = async (evaluationId: string) => {
  const db = await readDb();
  if (!db.evaluations) db.evaluations = [];
  
  const initialCount = db.evaluations.length;
  db.evaluations = db.evaluations.filter(evaluation => evaluation.id !== evaluationId);

  await writeDb(db);
  return { count: initialCount - db.evaluations.length };
};

// ===== STATISTICS =====
export const getDatabaseStats = async () => {
  const db = await readDb();
  
  return {
    totalUsers: (db.users || []).length,
    studentCount: (db.users || []).filter(u => u.role === 'student').length,
    tutorCount: (db.users || []).filter(u => u.role === 'tutor').length,
    adminCount: (db.users || []).filter(u => u.role === 'admin').length,
    totalAppointments: (db.appointments || []).length,
    totalDocuments: (db.documents || []).length,
    totalEvaluations: (db.evaluations || []).length,
    appointmentsByStatus: {
      pending: (db.appointments || []).filter(a => a.status === 'pending').length,
      confirmed: (db.appointments || []).filter(a => a.status === 'confirmed').length,
      completed: (db.appointments || []).filter(a => a.status === 'completed').length,
      cancelled: (db.appointments || []).filter(a => a.status === 'cancelled').length,
    },
    documentsByStatus: {
      active: (db.documents || []).filter(d => d.status === 'active').length,
      archived: (db.documents || []).filter(d => d.status === 'archived').length,
      deleted: (db.documents || []).filter(d => d.status === 'deleted').length,
    },
  };
};

// ===== BACKUP & RESTORE =====
export const getFullDatabase = async () => {
  return await readDb();
};

export const restoreDatabase = async (dbData: Db) => {
  await writeDb(dbData);
  return { message: 'Database restored successfully' };
};

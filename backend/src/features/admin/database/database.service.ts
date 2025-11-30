import path from 'path';
import fs from 'fs/promises';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

interface User {
  id: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  studentId?: string;
  tutorId?: string;
}

interface Student {
  id: string;
  userId: string;
  // other student fields
}

interface Tutor {
  id: string;
  userId: string;
  // other tutor fields
}

interface Db {
  users: User[];
  students: Student[];
  tutors: Tutor[];
  // other collections
}

async function readDb(): Promise<Db> {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export const getAllUsers = async () => {
  const db = await readDb();
  return db.users.map(user => {
    const student = db.students.find(s => s.userId === user.id);
    const tutor = db.tutors.find(t => t.userId === user.id);
    return {
      ...user,
      ...(student && { student }),
      ...(tutor && { tutor }),
    };
  });
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

  if (userData.student) {
    db.students = db.students.map(student => {
      if (student.userId === userId) {
        return { ...student, ...userData.student };
      }
      return student;
    });
  }

  if (userData.tutor) {
    db.tutors = db.tutors.map(tutor => {
      if (tutor.userId === userId) {
        return { ...tutor, ...userData.tutor };
      }
      return tutor;
    });
  }

  await writeDb(db);
  return updatedUser;
};

export const deleteUser = async (userId: string) => {
  const db = await readDb();
  const initialUserCount = db.users.length;

  db.users = db.users.filter(user => user.id !== userId);
  db.students = db.students.filter(student => student.userId !== userId);
  db.tutors = db.tutors.filter(tutor => tutor.userId !== userId);

  await writeDb(db);
  return { count: initialUserCount - db.users.length };
};

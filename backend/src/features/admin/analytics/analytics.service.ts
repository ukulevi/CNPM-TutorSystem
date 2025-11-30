import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'db', 'db.json');

interface Db {
    users: any[];
    appointments: any[];
    evaluations: any[];
    departments: any[];
}

const readDb = (): Db => {
    const dbRaw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(dbRaw);
};

export const getDashboardStats = async () => {
    const db = readDb();
    const totalUsers = db.users.length;
    const totalAppointments = db.appointments.length;
    const evaluations = db.evaluations;

    const totalRating = evaluations.reduce((sum, evalItem) => sum + evalItem.rating, 0);
    const averageRating = evaluations.length > 0 ? parseFloat((totalRating / evaluations.length).toFixed(1)) : 0;

    return {
        totalUsers,
        totalAppointments,
        averageRating,
    };
};

export const getAcademicReport = async () => {
    const db = readDb();
    const tutors = db.users.filter(u => u.role === 'tutor');
    const evaluations = db.evaluations;

    const tutorDepartmentMap = new Map<string, string>();
    tutors.forEach((tutor) => {
        if (tutor.department) {
            tutorDepartmentMap.set(tutor.id, tutor.department);
        }
    });

    const reportByDepartment: { [key: string]: { totalRating: number; count: number, totalSessions: number } } = {};

    db.appointments.forEach(appointment => {
        const tutor = tutors.find(t => t.id === appointment.tutorId);
        if (tutor && tutor.department) {
            if (!reportByDepartment[tutor.department]) {
                reportByDepartment[tutor.department] = { totalRating: 0, count: 0, totalSessions: 0 };
            }
            reportByDepartment[tutor.department].totalSessions++;
        }
    });

    evaluations.forEach((evaluation) => {
        const department = tutorDepartmentMap.get(evaluation.tutorId);
        if (department) {
            if (!reportByDepartment[department]) {
                reportByDepartment[department] = { totalRating: 0, count: 0, totalSessions: 0 };
            }
            reportByDepartment[department].totalRating += evaluation.rating;
            reportByDepartment[department].count++;
        }
    });

    const academicReport = Object.entries(reportByDepartment).map(([departmentName, data]) => ({
        departmentName,
        totalSessions: data.totalSessions,
        avgRating: data.count > 0 ? parseFloat((data.totalRating / data.count).toFixed(1)) : 0,
    }));

    return academicReport;
};
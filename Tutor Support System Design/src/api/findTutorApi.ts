import { Department, Tutor } from "../types";
import db from '../../db.json';

export type TutorFilters = {
    query?: string;
    department?: string;
};

/**
 * Giả lập việc lấy danh sách các giảng viên với các bộ lọc
 * @param filters Các bộ lọc tìm kiếm
 * @returns Danh sách giảng viên phù hợp
 */
export const getTutors = async (filters: TutorFilters): Promise<Tutor[]> => {
    let results = db.tutors as Tutor[]; // @ts-ignore

    if (filters.query) {
        const query = filters.query.toLowerCase();
        results = results.filter(t =>
            t.name.toLowerCase().includes(query) ||
            t.specialization.toLowerCase().includes(query)
        );
    }

    if (filters.department && filters.department !== 'all') {
        const departmentName = db.departments.find((d: Department) => d.id === filters.department)?.name;
        if (departmentName) {
            results = results.filter(t => t.department === departmentName);
        }
    }

    return Promise.resolve(results);
};

/**
 * Giả lập việc lấy danh sách các khoa
 * @returns Danh sách các khoa
 */
export const getDepartments = async (): Promise<Department[]> => {
    // @ts-ignore
    return Promise.resolve(db.departments as Department[]);
};
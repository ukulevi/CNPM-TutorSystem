import { Department, Tutor } from "../types";

export type TutorFilters = {
    query?: string;
    department?: string;
};

const API_URL = 'http://localhost:3001/api';

/**
 * Lấy danh sách các giảng viên với các bộ lọc
 * @param filters Các bộ lọc tìm kiếm
 * @returns Danh sách giảng viên phù hợp
 */
export const getTutors = async (filters: TutorFilters): Promise<Tutor[]> => {
    const [tutors, departments] = await Promise.all([
        fetch(`${API_URL}/search/tutors`).then(res => res.json()),
        fetch(`${API_URL}/search/departments`).then(res => res.json())
    ]);

    let results = tutors as Tutor[];

    if (filters.query) {
        const query = filters.query.toLowerCase();
        results = results.filter(t =>
            t.name.toLowerCase().includes(query) ||
            (t.specialization && t.specialization.toLowerCase().includes(query))
        );
    }

    if (filters.department && filters.department !== 'all') {
        const departmentName = departments.find((d: Department) => d.id === filters.department)?.name;
        if (departmentName) {
            results = results.filter(t => t.department === departmentName);
        }
    }

    return results;
};

/**
 * Lấy danh sách các khoa
 * @returns Danh sách các khoa
 */
export const getDepartments = async (): Promise<Department[]> => {
    const response = await fetch(`${API_URL}/search/departments`);
    if (!response.ok) {
        throw new Error('Failed to fetch departments');
    }
    return response.json();
};
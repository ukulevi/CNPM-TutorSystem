import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    const departments = [
        { id: 'cse', name: 'Khoa học và Kỹ thuật Máy tính' },
        { id: 'che', name: 'Kỹ thuật Hóa học' },
        { id: 'me', name: 'Kỹ thuật Cơ khí' },
        { id: 'eee', name: 'Điện - Điện tử' },
        { id: 'ce', name: 'Kỹ thuật Xây dựng' },
        { id: 'as', name: 'Khoa học Ứng dụng' },
    ];

    for (const department of departments) {
        await prisma.department.upsert({
            where: { id: department.id },
            update: {},
            create: department,
        });
    }

    const users = [
        {
            id: 'tutor-1',
            name: 'PGS.TS Nguyễn Thành Công',
            email: 'cong.nguyen@example.com',
            role: Role.TUTOR,
            avatar: 'https://i.pravatar.cc/150?u=tutor-1',
            departmentId: 'cse',
            tutor: {
                create: {
                    officeLocation: 'Phòng A1-101, Tòa nhà H6',
                    rating: 4.8,
                    specialization: 'Kỹ thuật phần mềm, Kiến trúc hệ thống, Cơ sở dữ liệu',
                    scheduleVisibility: 'public',
                    documentsVisibility: 'public',
                    publications: {
                        create: [
                            { title: 'Phân tích và thiết kế hệ thống hướng đối tượng', link: '#', public: true },
                            { title: 'Kiến trúc phần mềm cho hệ thống lớn', link: '#', public: true },
                        ],
                    },
                },
            },
        },
        {
            id: 'student-1',
            name: 'Nguyễn Văn An',
            email: 'an.nguyen@student.example.com',
            role: Role.STUDENT,
            avatar: 'https://i.pravatar.cc/150?u=student-1',
            departmentId: 'cse',
            student: {
                create: {
                    major: 'Kỹ thuật phần mềm',
                    cohort: 'K2021',
                },
            },
        },
    ];

    for (const u of users) {
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {},
            create: {
                id: u.id,
                email: u.email,
                name: u.name,
                role: u.role,
                avatar: u.avatar,
                departmentId: u.departmentId,
                student: u.student,
                tutor: u.tutor,
            },
        });
        console.log(`Created user with id: ${user.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });

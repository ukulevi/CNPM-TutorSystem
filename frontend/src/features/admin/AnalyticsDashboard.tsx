import React, { useState, useEffect } from 'react';
import { getDashboardStats, getAcademicReport } from './api/analyticsApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DashboardStats, AcademicReport } from '../../types/adminTypes';

export const AnalyticsDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [report, setReport] = useState<AcademicReport[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [statsData, reportData] = await Promise.all([
                    getDashboardStats(),
                    getAcademicReport(),
                ]);
                setStats(statsData);
                setReport(reportData);
            } catch (err) {
                setError('Failed to fetch analytics data.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Tổng số người dùng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tổng số cuộc hẹn</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalAppointments}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Đánh giá trung bình</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.averageRating}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            <div className="text-1 font-bold">Thống kê cuộc hẹn và đánh giá</div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Khoa</TableHead>
                                    <TableHead>Tổng số cuộc hẹn</TableHead>
                                    <TableHead>Đánh giá trung bình</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody> 
                                {report?.map((row) => (
                                    <TableRow key={row.departmentName}>
                                        <TableCell>{row.departmentName}</TableCell>
                                        <TableCell>{row.totalSessions}</TableCell>
                                        <TableCell>{row.avgRating}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
        </div>
    );
};

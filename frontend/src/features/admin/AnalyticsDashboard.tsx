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
        return <div>Loading analytics...</div>;
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalAppointments}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Average Rating</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.averageRating}</div>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Academic Report</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Department</TableHead>
                                <TableHead>Total Sessions</TableHead>
                                <TableHead>Average Rating</TableHead>
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

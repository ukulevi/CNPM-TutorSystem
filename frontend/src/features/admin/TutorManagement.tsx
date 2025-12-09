import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const API_URL = 'http://localhost:3001/api/admin/database';

interface Tutor {
    id: string;
    name: string;
    email: string;
    department?: string;
    specialization?: string;
    rating?: number;
}

export const TutorManagement: React.FC = () => {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTutors();
    }, []);

    const fetchTutors = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/users`);
            const data = await response.json();
            // Filter only tutors
            const tutorsData = data.filter((user: any) => user.role === 'tutor');
            setTutors(tutorsData);
        } catch (error) {
            console.error('Failed to fetch tutors:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateTutor = async () => {
        if (!editingTutor) return;
        try {
            await fetch(`${API_URL}/users/${editingTutor.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTutor),
            });
            setIsDialogOpen(false);
            setEditingTutor(null);
            fetchTutors();
        } catch (error) {
            console.error('Failed to update tutor:', error);
        }
    };

    const handleDeleteTutor = async (tutorId: string) => {
        if (!window.confirm('Are you sure you want to delete this tutor?')) return;
        try {
            await fetch(`${API_URL}/users/${tutorId}`, {
                method: 'DELETE',
            });
            fetchTutors();
        } catch (error) {
            console.error('Failed to delete tutor:', error);
        }
    };

    if (isLoading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quản lý Tutor</h2>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-gray-600">Tổng số Tutor: <strong>{tutors.length}</strong></h2>
            </div>

            {tutors.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                    <p className="text-lg">Không tìm thấy Tutor</p>
                    <p className="text-sm mt-2">Không có Tutor trong hệ thống</p>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                            <TableRow>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Tên</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Email</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Khoa</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Chuyên ngành</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Đánh giá</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4 text-right">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tutors.map((tutor) => (
                                <TableRow key={tutor.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium py-3 px-4 break-words">{tutor.name}</TableCell>
                                    <TableCell className="py-3 px-4 break-words">{tutor.email}</TableCell>
                                    <TableCell className="py-3 px-4 break-words">{tutor.department || 'N/A'}</TableCell>
                                    <TableCell className="py-3 px-4 break-words">{tutor.specialization || 'N/A'}</TableCell>
                                    <TableCell className="py-3 px-4">
                                        {tutor.rating ? (
                                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold inline-block">
                                                ⭐ {tutor.rating}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">Không có đánh giá</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-right space-x-2">
                                        <Dialog open={isDialogOpen && editingTutor?.id === tutor.id} onOpenChange={(open) => {
                                            setIsDialogOpen(open);
                                            if (!open) setEditingTutor(null);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    setEditingTutor(tutor);
                                                    setIsDialogOpen(true);
                                                }}>Chỉnh sửa</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Chỉnh sửa Tutor</DialogTitle>
                                                </DialogHeader>
                                                {editingTutor && (
                                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                                                        <div>
                                                            <Label htmlFor="name">Tên</Label>
                                                            <Input
                                                                id="name"
                                                                value={editingTutor.name || ''}
                                                                onChange={(e) => setEditingTutor({ ...editingTutor, name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="email">Email</Label>
                                                            <Input
                                                                id="email"
                                                                type="email"
                                                                value={editingTutor.email || ''}
                                                                onChange={(e) => setEditingTutor({ ...editingTutor, email: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="department">Khoa</Label>
                                                            <Input
                                                                id="department"
                                                                value={editingTutor.department || ''}
                                                                onChange={(e) => setEditingTutor({ ...editingTutor, department: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="specialization">Chuyên ngành</Label>
                                                            <Input
                                                                id="specialization"
                                                                value={editingTutor.specialization || ''}
                                                                onChange={(e) => setEditingTutor({ ...editingTutor, specialization: e.target.value })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor="rating">Đánh giá</Label>
                                                            <Input
                                                                id="rating"
                                                                type="number"
                                                                min="0"
                                                                max="5"
                                                                step="0.1"
                                                                value={editingTutor.rating || ''}
                                                                onChange={(e) => setEditingTutor({ ...editingTutor, rating: parseFloat(e.target.value) || undefined })}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2 justify-end pt-4 border-t">
                                                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                                                            <Button onClick={handleUpdateTutor}>Lưu</Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteTutor(tutor.id)}>Xóa</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

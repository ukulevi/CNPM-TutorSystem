import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import {  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const API_URL = 'http://localhost:3001/api/admin/database';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            console.log('Fetched users:', data);
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            await fetch(`${API_URL}/users/${editingUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingUser),
            });
            setIsDialogOpen(false);
            setEditingUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await fetch(`${API_URL}/users/${userId}`, {
                method: 'DELETE',
            });
            fetchUsers();
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quản lý người dùng</h2>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm text-gray-600">Tổng số người dùng: <strong>{users.length}</strong></h3>
            </div>

            <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                        <TableRow>
                            <TableHead className="font-semibold text-gray-700 py-3 px-4">Tên</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-3 px-4">Email</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-3 px-4">Vai trò</TableHead>
                            <TableHead className="font-semibold text-gray-700 py-3 px-4 text-justify-center">Hành động</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                                <TableCell className="font-medium py-3 px-4 break-words">{user.name}</TableCell>
                                <TableCell className="py-3 px-4 break-words">{user.email}</TableCell>
                                <TableCell className="py-3 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-800'  :
                                        user.role === 'tutor' ? 'bg-blue-100 text-blue-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role?.charAt(0).toUpperCase() + user.role?.slice(1).toLowerCase()}
                                    </span>
                                </TableCell>
                                <TableCell className="py-3 px-4 text-right space-x-2">
                                    <Dialog open={isDialogOpen && editingUser?.id === user.id} onOpenChange={(open) => {
                                        setIsDialogOpen(open);
                                        if (!open) setEditingUser(null);
                                    }}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" onClick={() => {
                                                setEditingUser(user);
                                                setIsDialogOpen(true);
                                            }}>Chỉnh sửa</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                                            </DialogHeader>
                                            {editingUser && (
                                                <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                                                    <div>
                                                        <Label htmlFor="name">Tên</Label>
                                                        <Input
                                                            id="name"
                                                            value={editingUser.name || ''}
                                                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="email">Email</Label>
                                                        <Input
                                                            id="email"
                                                            type="email"
                                                            value={editingUser.email || ''}
                                                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="role">Vai trò</Label>
                                                        <Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}>
                                                            <SelectTrigger id="role">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent className="w-full bg-white rounded-md shadow-md">
                                                                <SelectItem value="student" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Student</SelectItem>
                                                                <SelectItem value="tutor" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Tutor</SelectItem>
                                                                <SelectItem value="admin" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="flex gap-2 justify-end pt-4">
                                                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                                                        <Button onClick={handleUpdateUser}>Lưu</Button>
                                                    </div>
                                                </div>
                                            )}
                                        </DialogContent>
                                    </Dialog>
                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(user.id)}>Xóa</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import {  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const API_URL = 'http://localhost:3001/api/admin/database';

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [editingUser, setEditingUser] = useState<any | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const response = await fetch(`${API_URL}/users`);
        const data = await response.json();
        setUsers(data);
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        await fetch(`${API_URL}/users/${editingUser.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingUser),
        });
        setEditingUser(null);
        fetchUsers();
    };

    const handleDeleteUser = async (userId: string) => {
        await fetch(`${API_URL}/users/${userId}`, {
            method: 'DELETE',
        });
        fetchUsers();
    };

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" onClick={() => setEditingUser(user)}>Edit</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Edit User</DialogTitle>
                                        </DialogHeader>
                                        {editingUser && (
                                            <div className="space-y-4">
                                                <div>
                                                    <Label htmlFor="name">Name</Label>
                                                    <Input
                                                        id="name"
                                                        value={editingUser.name}
                                                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        value={editingUser.email}
                                                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor="role">Role</Label>
                                                    <Input
                                                        id="role"
                                                        value={editingUser.role}
                                                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                                                    />
                                                </div>
                                                <Button onClick={handleUpdateUser}>Save</Button>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
                                <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const API_BASE_URL = 'http://localhost:3001/api/admin/database';

interface Booking {
    id: string;
    studentId: string;
    tutorId: string;
    subject: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes?: string;
}

export const BookingManagement: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/appointments`);
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
                console.log('Loaded appointments:', data);
            } else {
                console.log('Failed to load appointments');
                setBookings([]);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            setBookings([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateBooking = async (booking: Booking) => {
        if (!editingBooking) return;
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${editingBooking.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingBooking),
            });

            if (response.ok) {
                setBookings(bookings.map(b => b.id === editingBooking.id ? editingBooking : b));
                setIsDialogOpen(false);
                setEditingBooking(null);
            } else {
                console.error('Failed to update booking');
            }
        } catch (error) {
            console.error('Failed to update booking:', error);
        }
    };

    const handleDeleteBooking = async (bookingId: string) => {
        if (!window.confirm('Are you sure you want to delete this booking?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${bookingId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBookings(bookings.filter(b => b.id !== bookingId));
            } else {
                console.error('Failed to delete booking');
            }
        } catch (error) {
            console.error('Failed to delete booking:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'booked':
                return 'bg-yellow-100 text-yellow-800';
            case 'upcoming':
                return 'bg-blue-100 text-blue-800';
            case 'ongoing':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'evaluated':
                return 'bg-orange-100 text-purple-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredBookings = filterStatus === 'all'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    const sortedBookings = [...filteredBookings].sort((a, b) => {
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCompare !== 0) return dateCompare; // Xếp theo ngày mới trước
        return a.time.localeCompare(b.time); // Nếu cùng ngày, xếp theo giờ
    });

    if (isLoading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quản lý cuộc hẹn</h2>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm text-gray-600">Tổng số cuộc hẹn: <strong>{bookings.length}</strong></h2>
            </div>

            {filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                    <p className="text-lg">Không tìm thấy cuộc hẹn</p>
                    <p className="text-sm mt-2">{filterStatus !== 'all' ? `Không có cuộc hẹn với trạng thái "${filterStatus}"` : 'Bắt đầu bằng cách tạo một cuộc hẹn'}</p>
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                            <TableRow>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Student ID</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Tutor ID</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Môn học</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Ngày</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Thời gian</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Trạng thái</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4 text-justify-center">Hành động</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedBookings.map((booking) => (
                                <TableRow key={booking.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium py-3 px-4 break-words">{booking.studentId}</TableCell>
                                    <TableCell className="py-3 px-4 break-words">{booking.tutorId}</TableCell>
                                    <TableCell className="py-3 px-4 break-words">{booking.subject}</TableCell>
                                    <TableCell className="py-3 px-4">{new Date(booking.date).toLocaleDateString()}</TableCell>
                                    <TableCell className="py-3 px-4">{booking.time}</TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge className={getStatusColor(booking.status)}>
                                            {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1).toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-right space-x-2">
                                        <Dialog open={isDialogOpen && editingBooking?.id === booking.id} onOpenChange={(open) => {
                                            setIsDialogOpen(open);
                                            if (!open) setEditingBooking(null);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm" onClick={() => {
                                                    setEditingBooking(booking);
                                                    setIsDialogOpen(true);
                                                }}>Chỉnh sửa</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Chỉnh sửa Cuộc hẹn</DialogTitle>
                                                </DialogHeader>
                                                {editingBooking && (
                                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-4">
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Student ID</label>
                                                            <input
                                                                type="text"
                                                                value={editingBooking.studentId || ''}
                                                                onChange={(e) => setEditingBooking({ ...editingBooking, studentId: e.target.value })}
                                                                className="w-full px-2 py-1 border rounded"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Tutor ID</label>
                                                            <input
                                                                type="text"
                                                                value={editingBooking.tutorId || ''}
                                                                onChange={(e) => setEditingBooking({ ...editingBooking, tutorId: e.target.value })}
                                                                className="w-full px-2 py-1 border rounded"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Môn học</label>
                                                            <input
                                                                type="text"
                                                                value={editingBooking.subject || ''}
                                                                onChange={(e) => setEditingBooking({ ...editingBooking, subject: e.target.value })}
                                                                className="w-full px-2 py-1 border rounded"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Ngày</label>
                                                            <input
                                                                type="date"
                                                                value={editingBooking.date ? new Date(editingBooking.date).toISOString().split('T')[0] : ''}
                                                                onChange={(e) => setEditingBooking({ ...editingBooking, date: e.target.value })}
                                                                className="w-full px-2 py-1 border rounded"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Giờ</label>
                                                            <input
                                                                type="time"
                                                                value={editingBooking.time || ''}
                                                                onChange={(e) => setEditingBooking({ ...editingBooking, time: e.target.value })}
                                                                className="w-full px-2 py-1 border rounded"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Trạng thái</label>
                                                            <Select value={editingBooking.status} onValueChange={(value: any) => setEditingBooking({ ...editingBooking, status: value })}>
                                                                <SelectTrigger>
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="w-full bg-white rounded-md shadow-md">
                                                                    <SelectItem value="booked" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Booked</SelectItem>
                                                                    <SelectItem value="upcoming" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Upcoming</SelectItem>
                                                                    <SelectItem value="ongoing" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Ongoing</SelectItem>
                                                                    <SelectItem value="completed" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Completed</SelectItem>
                                                                    <SelectItem value="evaluated" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Evaluated</SelectItem>
                                                                    <SelectItem value="cancelled" className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1">Cancelled</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium mb-1">Notes</label>
                                                            <textarea
                                                                value={editingBooking.notes || ''}
                                                                onChange={(e) => setEditingBooking({ ...editingBooking, notes: e.target.value })}
                                                                className="w-full px-2 py-1 border rounded"
                                                                rows={3}
                                                            />
                                                        </div>
                                                        <div className="flex gap-2 justify-end pt-4 border-t">
                                                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
                                                            <Button onClick={() => handleUpdateBooking(booking)}>Lưu</Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteBooking(booking.id)}>Xóa</Button>
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

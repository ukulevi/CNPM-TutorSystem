import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Trash2, Download, Share2, Archive, RotateCcw, Search } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3001/api/admin/database';

interface Document {
    id: string;
    userId: string;
    userName?: string;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    visibility: 'public' | 'private';
    pinned: boolean;
    url?: string;
}

export const DocumentManagement: React.FC = () => {
    const [allDocuments, setAllDocuments] = useState<Document[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showActions] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            // Fetch users first
            try {
                const usersResponse = await fetch(`${API_BASE_URL}/users`);
                if (usersResponse.ok) {
                    const usersData = await usersResponse.json();
                    setUsers(usersData);

                    // Then fetch documents and enrich with user names
                    const docsResponse = await fetch(`${API_BASE_URL}/documents`);
                    if (docsResponse.ok) {
                        const docsData = await docsResponse.json();
                        const docsWithNames = docsData.map((doc: Document) => {
                            const user = usersData.find((u: any) => u.id === doc.userId);
                            return {
                                ...doc,
                                userName: user?.name || 'Unknown User'
                            };
                        });
                        setAllDocuments(docsWithNames);
                        setFilteredDocuments(docsWithNames);
                        console.log('Loaded documents:', docsWithNames);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setAllDocuments([]);
                setFilteredDocuments([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        // Filter documents based on search query (by username)
        if (!searchQuery.trim()) {
            setFilteredDocuments(allDocuments);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = allDocuments.filter(doc =>
                doc.userName?.toLowerCase().includes(query)
            );
            setFilteredDocuments(filtered);
        }
    }, [searchQuery, allDocuments]);

    const handleDeleteDocument = async (docId: string) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/documents/${docId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAllDocuments(allDocuments.filter(d => d.id !== docId));
            } else {
                console.error('Failed to delete document');
            }
        } catch (error) {
            console.error('Failed to delete document:', error);
        }
    };

    const handlePin = (doc: Document) => {
        // Toggle pin status
        console.log(`Pinning document: ${doc.name}`);
        // In a real app, you would update this in the database
    };

    const handleShare = (doc: Document) => {
        // Toggle visibility between public/private
        const newVisibility = doc.visibility === 'public' ? 'private' : 'public';
        console.log(`Sharing document: ${doc.name} - New visibility: ${newVisibility}`);
        // In a real app, you would update this in the database
    };

    const handleArchive = (doc: Document) => {
        console.log(`Archiving document: ${doc.name}`);
        // In a real app, you would move this to archived status
    };

    const handleDownload = (doc: Document) => {
        console.log(`Downloading document: ${doc.name}`);
        // In a real app, you would initiate the download
    };

    // const getFileTypeIcon = (fileType: string) => {
    //     if (fileType.includes('pdf')) return '📄';
    //     if (fileType.includes('pptx') || fileType.includes('presentation')) return '🎬';
    //     if (fileType.includes('doc')) return '📝';
    //     if (fileType.includes('zip')) return '📦';
    //     if (fileType.includes('image')) return '🖼️';
    //     return '📎';
    // };

    if (isLoading) {
        return <div className="text-center py-8">Đang tải tài liệu...</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Quản lý tài liệu</h2>
            </div>

            {/* Search Bar */}
            <div className="flex gap-5 items-end">
                <div className="flex-1">
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Tìm kiếm tài liệu theo tên người dùng</Label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Nhập tên người dùng (VD: Nguyễn Văn An)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                {/* <Button
                    variant={showActions ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowActions(!showActions)}
                    className={showActions ? "bg-[#003366] hover:bg-[#004488]" : ""}
                >
                    {showActions ? "✓ Hiện hành động" : "Hiện hành động"}
                </Button> */}
            </div>

            {/* Results Summary */}
            <div className="text-sm text-gray-600">
                {searchQuery && (
                    <p>
                        Tìm thấy <strong>{filteredDocuments.length}</strong> tài liệu của
                        <strong className="text-[#003366]"> {searchQuery}</strong>
                    </p>
                )}
                {!searchQuery && (
                    <p>Tổng cộng: <strong>{allDocuments.length}</strong> tài liệu</p>
                )}
            </div>

            {filteredDocuments.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border rounded-lg bg-gray-50">
                    <p className="text-lg">Không tìm thấy tài liệu</p>
                    {searchQuery && (
                        <p className="text-sm mt-2">
                            Không có tài liệu nào của người dùng <strong>{searchQuery}</strong>
                        </p>
                    )}
                    {!searchQuery && (
                        <p className="text-sm mt-2">Hệ thống hiện chưa có tài liệu</p>
                    )}
                </div>
            ) : (
                <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                            <TableRow>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Tên tài liệu</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Người dùng</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Kiểu</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Kích thước</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Ngày tải lên</TableHead>
                                <TableHead className="font-semibold text-gray-700 py-3 px-4">Độ hiển thị</TableHead>
                                {/* {showActions && ( */}
                                <TableHead className="font-semibold text-gray-700 py-3 px-4 text-right">Hành động</TableHead>
                                {/* )} */}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDocuments.map((doc) => (
                                <TableRow key={doc.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <TableCell className="font-medium py-3 px-4 flex items-center gap-2 break-words">
                                        {/* <span className="text-lg flex-shrink-0">{getFileTypeIcon(doc.type)}</span> */}
                                        <span className="max-w-xs">{doc.name}</span>
                                        {doc.pinned && (
                                            <span className="text-xs ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Ghim</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-sm break-words font-medium text-[#003366]">
                                        {doc.userName || 'Unknown'}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                            {doc.type.toUpperCase()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-3 px-4 text-sm">{doc.size}</TableCell>
                                    <TableCell className="py-3 px-4 text-sm">
                                        {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
                                    </TableCell>
                                    <TableCell className="py-3 px-4">
                                        <Badge className={doc.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                            {doc.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                                        </Badge>
                                    </TableCell>
                                    {(!showActions) && (
                                        <TableCell className="py-3 px-4 text-right">
                                            <div className="flex gap-2 justify-end flex-wrap">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Xem chi tiết"
                                                            className="h-8"
                                                        >
                                                            Xem
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-md">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-[#003366]">Chi tiết tài liệu</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-3">
                                                            <div>
                                                                <Label className="text-xs text-gray-600">Tên tài liệu</Label>
                                                                <p className="font-medium">{doc.name}</p>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600">Người dùng</Label>
                                                                <p className="font-medium text-[#003366]">{doc.userName}</p>
                                                            </div>
                                                            <div className="grid grid-cols-3 gap-2">
                                                                <div>
                                                                    <Label className="text-xs text-gray-600">Kiểu</Label>
                                                                    <p className="font-medium text-sm">{doc.type}</p>
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs text-gray-600">Kích thước</Label>
                                                                    <p className="font-medium text-sm">{doc.size}</p>
                                                                </div>
                                                                <div>
                                                                    <Label className="text-xs text-gray-600">Ghim</Label>
                                                                    <p className="font-medium text-sm">{doc.pinned ? '✓' : '✗'}</p>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600">Độ hiển thị</Label>
                                                                <Badge className={doc.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                                    {doc.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                                                                </Badge>
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-gray-600">Ngày tải lên</Label>
                                                                <p className="font-medium text-sm">
                                                                    {new Date(doc.uploadDate).toLocaleDateString('vi-VN')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                {/* <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDownload(doc)}
                                                    title="Tải xuống"
                                                    className="h-8"
                                                >
                                                    <Download className="h-4 w-4" />
                                                </Button>
 */}
                                                {/* <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleShare(doc)}
                                                    title={doc.visibility === 'public' ? 'Làm riêng tư' : 'Chia sẻ công khai'}
                                                    className={`h-8 ${doc.visibility === 'public' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                                                >
                                                    <Share2 className="h-4 w-4" />
                                                </Button> */}

                                                {/* <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handlePin(doc)}
                                                    title={doc.pinned ? 'Bỏ ghim' : 'Ghim'}
                                                    className={`h-8 ${doc.pinned ? 'bg-yellow-50 border-yellow-200' : ''}`}
                                                >
                                                    {doc.pinned ? '📌' : '📍'}
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleArchive(doc)}
                                                    title="Lưu trữ"
                                                    className="h-8"
                                                >
                                                    <Archive className="h-4 w-4" />
                                                </Button>
 */}
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDeleteDocument(doc.id)}
                                                    title="Xoá"
                                                    className="h-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
};

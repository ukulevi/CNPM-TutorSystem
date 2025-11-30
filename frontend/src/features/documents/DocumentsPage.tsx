// Document management page - allows users to upload, view, and manage documents
// Features: Upload documents, toggle visibility (public/private), pin/unpin, delete documents
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Upload, File, FileText, Image, MoreVertical, Trash2, Pin, PinOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Sidebar } from '../../components/shared/Sidebar';
import { getDocuments, uploadDocument, updateDocumentVisibility, deleteDocument, toggleDocumentPin } from './api/documentApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Document as Doc } from '../../types';
type DocumentsPageProps = {
  userRole: 'student' | 'tutor';
  currentUserId: string; // Thêm ID của người dùng hiện tại
  onNavigate: (page: string) => void;
  onGoBack: () => void;
};
const fileIcons = {
  pdf: <FileText className="w-6 h-6 text-red-500" />,
  doc: <FileText className="w-6 h-6 text-blue-500" />,
  image: <Image className="w-6 h-6 text-green-500" />,
  other: <File className="w-6 h-6 text-gray-500" />,
};
export function DocumentsPage({ userRole, currentUserId, onNavigate, onGoBack }: DocumentsPageProps) {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadVisibility, setUploadVisibility] = useState<'public' | 'private'>('private');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialDocuments, setInitialDocuments] = useState<Doc[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Doc | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      const data = await getDocuments(currentUserId); // Sử dụng ID thật
      setInitialDocuments(JSON.parse(JSON.stringify(data))); // Lưu trạng thái ban đầu
      setDocuments(data);
      setIsLoading(false);
    };
    fetchDocs();
  }, []);

  // Handle file selection - validates and prepares file for upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file with same name already exists - prevents duplicate uploads
      const fileExists = documents.some(doc => doc.name === file.name);
      if (fileExists) {
        setUploadError(`File "${file.name}" đã tồn tại!`);
        setShowUploadDialog(false);
        // Auto-clear error message after 3 seconds
        setTimeout(() => setUploadError(null), 3000);
        return;
      }
      setUploadError(null);
      setFileToUpload(file);
      setShowUploadDialog(true);
    }
  };

  // Upload file to backend with specified visibility
  const handleUpload = async () => {
    if (!fileToUpload) return;
    setShowUploadDialog(false);
    try {
      // Call API to upload document
      const response = await uploadDocument(fileToUpload, uploadVisibility, currentUserId);
      // Handle both direct document and wrapped response from API
      const newDoc = response.document || response;
      // Add newly uploaded document to the top of the list
      setDocuments(prev => [newDoc, ...prev]);
      // Reset upload state
      setFileToUpload(null);
      setUploadVisibility('private');
      setUploadError(null);
    } catch (error) {
      setUploadError('Failed to upload document. Please try again.');
      console.error('Upload error:', error);
    }
  };

  // Update document visibility (public/private) - immediate UI update
  const handleVisibilityChange = async (docId: string, visibility: 'public' | 'private') => {
    // Update local state immediately for responsive UI
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, visibility } : d));
    // Mark that there are unsaved changes
    setHasUnsavedChanges(true);
  };

  // Toggle document pin status - immediate UI update
  const handleTogglePin = async (doc: Doc) => {
    // Update local state immediately for responsive UI
    setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, pinned: !d.pinned } : d));
    // Mark that there are unsaved changes
    setHasUnsavedChanges(true);
  };

  // Save all visibility and pin changes to backend
  const handleSaveChanges = async () => {
    // Lặp qua các tài liệu đã thay đổi và gọi API tương ứng
    // Use sequential calls instead of Promise.all to avoid concurrent database writes
    try {
      for (const doc of documents) {
        const initialDoc = initialDocuments.find(d => d.id === doc.id);
        // Only call API if something actually changed
        if (!initialDoc) {
          // New document (shouldn't happen in this context)
          continue;
        }

        // Check visibility change
        if (initialDoc.visibility !== doc.visibility) {
          const result = await updateDocumentVisibility(doc.id, doc.visibility);
          if (!result) {
            console.warn(`Failed to update visibility for ${doc.id}`);
          }
          continue;
        }

        // Check pinned change
        if (initialDoc.pinned !== doc.pinned) {
          const result = await toggleDocumentPin(doc.id, doc.pinned);
          if (!result) {
            console.warn(`Failed to toggle pin for ${doc.id}`);
          }
        }
      }

      setInitialDocuments(JSON.parse(JSON.stringify(documents))); // Cập nhật trạng thái ban đầu
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving changes:', error);
      setUploadError('Failed to save some changes. Please try again.');
      setTimeout(() => setUploadError(null), 3000);
    }
  };

  const handleCancelChanges = () => {
    setDocuments(initialDocuments); // Hoàn tác về trạng thái ban đầu
    setHasUnsavedChanges(false);
  };
  const openDeleteDialog = (doc: Doc) => {
    setDocToDelete(doc);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!docToDelete) return;
    const result = await deleteDocument(docToDelete.id);
    // Check if deletion was successful (backend returns { success: true })
    const success = result?.success !== false;
    if (success) {
      setDocuments(prev => prev.filter(d => d.id !== docToDelete.id));
    } else {
      setUploadError('Failed to delete document. Please try again.');
      setTimeout(() => setUploadError(null), 3000);
    }
    setShowDeleteDialog(false);
    setDocToDelete(null);
  };
  return (
    <div className="flex">
      <Sidebar
        userRole={userRole}
        userName={userRole === 'tutor' ? 'PGS.TS Nguyễn Thành Công' : 'Nguyễn Văn A'}
        currentPage="documents"
        onNavigate={onNavigate}
        onLogout={() => onNavigate('login')}
      />
      <div className="flex-1 bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mb-4 text-[#003366] -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          {/* Error message */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {uploadError}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[#003366]">Kho tài liệu</h1>
              <p className="text-gray-600">Quản lý và chia sẻ tài liệu học tập của bạn</p>
            </div>
            <Button onClick={() => fileInputRef.current?.click()} className="bg-[#003366] hover:bg-[#004488]">
              <Upload className="w-4 h-4 mr-2" />
              Tải lên tài liệu mới
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileSelect}
              accept="image/*,.pdf,.doc,.docx"
            />
          </div>
        </div>

        {/* Unsaved Changes Bar */}
        {hasUnsavedChanges && (
          <div className="sticky top-0 z-10 bg-yellow-100 border-b border-yellow-300 px-8 py-3 flex items-center justify-between shadow-sm">
            <p className="text-sm text-yellow-800 font-medium">
              Bạn có những thay đổi chưa được lưu.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancelChanges}>Hủy</Button>
              <Button size="sm" className="bg-[#003366] hover:bg-[#004488]" onClick={handleSaveChanges}>
                Lưu thay đổi
              </Button>
            </div>
          </div>
        )}

        <div className="p-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#003366]">Tài liệu của tôi</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-10">Đang tải tài liệu...</div>
              ) : (
                <div className="space-y-3">
                  {documents
                    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)) // Sắp xếp tài liệu đã ghim lên đầu
                    .map(doc => (
                      <div
                        key={doc.id}
                        className={`flex items-center justify-between p-4 rounded-lg transition-colors ${doc.visibility === 'public' ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                      >
                        <div className="flex items-center gap-4">
                          {fileIcons[doc.type]}
                          <div>
                            <a href={doc.url} className="text-[#003366] font-medium hover:underline">{doc.name}</a>
                          </div>
                        </div>                      
                        <div className="flex items-center gap-4">
                          <Select
                            value={doc.visibility}
                            onValueChange={(value: 'public' | 'private') => handleVisibilityChange(doc.id, value)}
                          >
                            <SelectTrigger className="w-full focus:ring-0">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent
                              position="popper"
                              style={{ width: '100px' }}
                              className="w-full bg-white rounded-md shadow-md"
                            >
                              <SelectItem
                                value="public"
                                className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1"
                              >
                                <span>Công khai</span>
                              </SelectItem>
                              <SelectItem
                                value="private"
                                className="grid grid-cols-[2px_1fr] place-items-right px-3 py-1"
                              >
                                <span>Riêng tư</span>
                              </SelectItem>   
                            </SelectContent>
                          </Select>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              {doc.pinned ? (
                                <DropdownMenuItem onClick={() => handleTogglePin(doc)}>
                                  <PinOff className="w-4 h-4 mr-2" /> Bỏ ghim
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleTogglePin(doc)}>
                                  <Pin className="w-4 h-4 mr-2" /> Ghim tài liệu
                                </DropdownMenuItem>                           
                              )}
                              <DropdownMenuItem onClick={() => openDeleteDialog(doc)} className="text-red-600 focus:text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" /> Xóa tài liệu
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tải lên tài liệu</DialogTitle>
            <DialogDescription>
              Chọn trạng thái hiển thị cho tài liệu của bạn.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="p-4 border rounded-md bg-gray-50">
              <p className="font-medium">{fileToUpload?.name}</p>
              
              <p className="text-sm text-gray-500">{(fileToUpload?.size || 0) / 1024 > 1024 ? `${((fileToUpload?.size || 0) / (1024 * 1024)).toFixed(2)} MB` : `${((fileToUpload?.size || 0) / 1024).toFixed(2)} KB`}</p>
            </div>
            {/* Document visibility options - displayed as clickable items */}
            <div className="space-y-2">
              <Label>Ai có thể xem tài liệu này?</Label>
              
              <div className="space-y-2 mt-2">
                {/* Public option for document visibility */}
                <button
                  onClick={() => setUploadVisibility('public')}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    uploadVisibility === 'public'
                      ? 'border-[#003366] bg-[#E0F7FF]'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    uploadVisibility === 'public'
                      ? 'border-[#003366] bg-[#003366]'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {uploadVisibility === 'public' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#003366]">Công khai</p>
                    <p className="text-xs text-gray-600 whitespace-nowrap">Mọi người có thể xem</p>
                  </div>
                </button>
                {/* Private option for document visibility */}
                <button
                  onClick={() => setUploadVisibility('private')}
                  className={`w-full flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    uploadVisibility === 'private'
                      ? 'border-[#003366] bg-[#E0F7FF]'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    uploadVisibility === 'private'
                      ? 'border-[#003366] bg-[#003366]'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {uploadVisibility === 'private' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#003366]">Riêng tư</p>
                    <p className="text-xs text-gray-600 whitespace-nowrap">Chỉ bạn có thể xem</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>Hủy</Button>
            <Button onClick={handleUpload} className="bg-[#003366] hover:bg-[#004488]">Xác nhận tải lên</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác.
              <p className="font-medium text-gray-700 mt-2">{docToDelete?.name}</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
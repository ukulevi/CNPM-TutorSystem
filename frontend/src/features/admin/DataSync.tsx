import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Download, Upload, Database, AlertCircle } from 'lucide-react';
import { getSyncStatus, exportData, backupDatabase, importData } from './api/dataSyncApi';
import { SyncStatus } from './api/dataSyncApi';

export const DataSync: React.FC = () => {
    const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        fetchSyncStatus();
    }, []);

    const fetchSyncStatus = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const status = await getSyncStatus();
            setSyncStatus(status);
        } catch (err) {
            setError('Failed to fetch sync status.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            setError(null);
            const data = await exportData();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `database_export_${new Date().toISOString().slice(0, 10)}.json`;
            link.click();
            setSuccessMessage('Database exported successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            setError('Failed to export database.');
            console.error(err);
        }
    };

    const handleBackup = async () => {
        try {
            setError(null);
            const result = await backupDatabase();
            setSuccessMessage(result.message);
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchSyncStatus();
        } catch (err) {
            setError('Failed to backup database.');
            console.error(err);
        }
    };

    const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setError(null);
            const fileContent = await file.text();
            const data = JSON.parse(fileContent);
            const result = await importData(data);
            setSuccessMessage(`${result.recordsImported} records imported successfully!`);
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchSyncStatus();
        } catch (err) {
            setError('Failed to import database. Please check the file format.');
            console.error(err);
        }
    };

    if (isLoading) {
        return <div>Đang tải dữ liệu đồng bộ...</div>;
    }

    return (
        <div className="flex flex-col space-y-4">
            {error && (
                <Alert className="border-red-500 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
            )}

            {successMessage && (
                <Alert className="border-green-500 bg-green-50">
                    <AlertCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Trạng thái đồng bộ
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {syncStatus && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600">Thời gian đồng bộ cuối cùng</p>
                                <p className="font-semibold">{new Date(syncStatus.lastSyncTime).toLocaleString()}</p>
                            </div>
                            <div>
                                {/* <p className="text-sm text-gray-600 mb-2">Collections</p> */}
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.entries(syncStatus.collections).map(([name, info]) => (
                                        <div key={name} className="bg-gray-50 p-3 rounded">
                                            <p className="text-xs text-gray-600 uppercase">{name}</p>
                                            <p className="text-lg font-bold text-[#003366]">{info.count}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Space between cards */}
            <div className="my-4" />


            <Card>
                <CardHeader>
                    <CardTitle>Quản lý dữ liệu</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button onClick={handleExport} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                            <Upload className="h-5 w-5" />
                            <span>Xuất cơ sở dữ liệu</span>
                        </Button>

                        <Button onClick={handleBackup} variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                            <Database className="h-5 w-5" />
                            <span>Tạo bản sao lưu</span>
                        </Button>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
                                    <Download className="h-5 w-5" />
                                    <span>Nhập cơ sở dữ liệu</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Nhập cơ sở dữ liệu</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <Alert className="border-yellow-500 bg-yellow-50">
                                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                                        <AlertDescription className="text-yellow-800">
                                            Vui lòng đảm bảo rằng tệp JSON bạn nhập có định dạng đúng và tương thích với hệ thống.
                                        </AlertDescription>
                                    </Alert>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleImport}
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

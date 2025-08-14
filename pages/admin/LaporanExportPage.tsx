
import React from 'react';
import { Layout } from '../../components/Layout';
import { Card, Button } from '../../components/ui';

const LaporanExportPage: React.FC = () => {
    
    const handleExport = (format: 'Excel' | 'PDF') => {
        alert(`Simulasi: Mengekspor semua data ke ${format}...`);
        // In a real app, this would trigger a download.
        // For Excel, you could use a library like 'xlsx'.
        // For PDF, you could use 'jspdf' and 'jspdf-autotable'.
    };

    return (
        <Layout>
            <Card title="Laporan & Export Data">
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Gunakan fitur ini untuk mengunduh seluruh data kepegawaian dalam format Excel atau PDF.
                        Proses ini mungkin memakan waktu beberapa saat tergantung pada jumlah data.
                    </p>
                    <div className="flex space-x-4 pt-4">
                        <Button onClick={() => handleExport('Excel')}>
                            Export ke Excel (.xlsx)
                        </Button>
                        <Button variant="secondary" onClick={() => handleExport('PDF')}>
                            Export ke PDF (.pdf)
                        </Button>
                    </div>
                </div>
            </Card>
        </Layout>
    );
};

export default LaporanExportPage;

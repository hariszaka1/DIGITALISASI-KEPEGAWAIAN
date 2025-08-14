
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../components/Layout';
import { Card, InputField, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/mockApi';
import { Pegawai } from '../../types';

const PencarianUserPage: React.FC = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [pegawaiData, setPegawaiData] = useState<Pegawai | null>(null);
    const [searchResult, setSearchResult] = useState<Pegawai | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (user?.pegawaiId) {
            setLoading(true);
            const data = await api.getPegawaiById(user.pegawaiId);
            setPegawaiData(data);
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!pegawaiData || !searchTerm) {
            setSearchResult(null);
            return;
        }

        const term = searchTerm.toLowerCase();
        const isMatch = 
            pegawaiData.nama.toLowerCase().includes(term) ||
            pegawaiData.nik.includes(term) ||
            pegawaiData.nip.includes(term) ||
            pegawaiData.jabatan.toLowerCase().includes(term);

        if (isMatch) {
            setSearchResult(pegawaiData);
        } else {
            setSearchResult(null);
        }
    };
    
    if (loading) return <Layout><div>Memuat...</div></Layout>

    return (
        <Layout>
            <Card title="Pencarian Data Pribadi">
                <form onSubmit={handleSearch} className="flex space-x-2">
                    <InputField
                        label=""
                        placeholder="Cari berdasarkan nama, NIK, NIP, atau jabatan..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow"
                    />
                    <Button type="submit">Cari</Button>
                </form>
            </Card>

            <div className="mt-6">
                {searchResult ? (
                    <Card title="Hasil Pencarian">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><strong>Nama:</strong> {searchResult.nama}</p>
                            <p><strong>NIK:</strong> {searchResult.nik}</p>
                            <p><strong>NIP:</strong> {searchResult.nip}</p>
                            <p><strong>Jabatan:</strong> {searchResult.jabatan}</p>
                             <p><strong>Email:</strong> {searchResult.email}</p>
                            <p><strong>Nomor Telepon:</strong> {searchResult.nomorTelepon}</p>
                        </div>
                    </Card>
                ) : (
                    searchTerm && <Card><p>Data tidak ditemukan untuk kata kunci "{searchTerm}". Anda hanya dapat mencari data Anda sendiri.</p></Card>
                )}
            </div>
        </Layout>
    );
};

export default PencarianUserPage;

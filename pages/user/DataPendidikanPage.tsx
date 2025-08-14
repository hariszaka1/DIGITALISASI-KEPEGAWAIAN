import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../components/Layout';
import { Card, InputField, FileUpload, Button, SelectField } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/mockApi';
import { Pendidikan } from '../../types';
import { TINGKAT_PENDIDIKAN } from '../../constants';
import { PlusCircleIcon, TrashIcon } from '../../components/icons';


const PendidikanEntry: React.FC<{ pendidikan: Pendidikan; onUpdate: (id: string, field: string, value: any) => void; onRemove: (id: string) => void }> = ({ pendidikan, onUpdate, onRemove }) => {
    const [ijazahFile, setIjazahFile] = useState<File | null>(null);

    const handleFileChange = (file: File | null) => {
        setIjazahFile(file);
        // In a real app, this would trigger an upload and then call onUpdate with the new URL
        if(file) {
            onUpdate(pendidikan.id, 'fotoIjazahUrl', URL.createObjectURL(file));
        }
    }

    return (
        <div className="border rounded-lg p-4 relative space-y-4">
            <button type="button" onClick={() => onRemove(pendidikan.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                <TrashIcon className="w-5 h-5"/>
            </button>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <SelectField
                        label="Tingkat Pendidikan"
                        value={pendidikan.tingkat}
                        options={TINGKAT_PENDIDIKAN}
                        onChange={(e) => onUpdate(pendidikan.id, 'tingkat', e.target.value as any)}
                    />
                </div>
                <InputField label="Nama Sekolah" value={pendidikan.namaSekolah} onChange={(e) => onUpdate(pendidikan.id, 'namaSekolah', e.target.value)} />
                <InputField label="Nomor Ijazah" value={pendidikan.noIjazah} onChange={(e) => onUpdate(pendidikan.id, 'noIjazah', e.target.value)} />
                <InputField label="Tahun Masuk" type="number" value={pendidikan.tahunMasuk} onChange={(e) => onUpdate(pendidikan.id, 'tahunMasuk', e.target.value)} />
                <InputField label="Tahun Lulus" type="number" value={pendidikan.tahunLulus} onChange={(e) => onUpdate(pendidikan.id, 'tahunLulus', e.target.value)} />
                <div className="md:col-span-2">
                    <FileUpload label="Upload Foto Ijazah" id={`ijazah-${pendidikan.id}`} onChange={handleFileChange} previewUrl={pendidikan.fotoIjazahUrl} />
                </div>
            </div>
        </div>
    );
}

const DataPendidikanPage: React.FC = () => {
    const { user } = useAuth();
    const [pendidikanList, setPendidikanList] = useState<Pendidikan[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const fetchData = useCallback(async () => {
        if (user?.pegawaiId) {
            setLoading(true);
            try {
                const data = await api.getPegawaiById(user.pegawaiId);
                if (data) {
                    const sortedPendidikan = [...data.pendidikan].sort((a, b) => TINGKAT_PENDIDIKAN.indexOf(b.tingkat) - TINGKAT_PENDIDIKAN.indexOf(a.tingkat));
                    setPendidikanList(sortedPendidikan);
                }
            } catch (error) {
                setFeedback({type: 'error', message: 'Gagal memuat data pendidikan.'});
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleUpdate = (id: string, field: string, value: any) => {
        setPendidikanList(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    };
    
    const handleAdd = () => {
        const newPendidikan: Pendidikan = {
            id: `new-${Date.now()}`,
            tingkat: 'SD',
            namaSekolah: '',
            tahunMasuk: '',
            tahunLulus: '',
            noIjazah: '',
        };
        setPendidikanList(prev => [newPendidikan, ...prev]);
    }
    
    const handleRemove = (id: string) => {
        setPendidikanList(prev => prev.filter(p => p.id !== id));
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.pegawaiId) return;
        setSaving(true);
        setFeedback(null);
        try {
            await api.updatePendidikan(user.pegawaiId, pendidikanList);
            setFeedback({type: 'success', message: 'Data pendidikan berhasil disimpan!'});
        } catch (error) {
            setFeedback({type: 'error', message: 'Gagal menyimpan data pendidikan.'});
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) return <Layout><div>Memuat data...</div></Layout>;

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <Card title="Data Pendidikan">
                    <div className="space-y-6">
                        {pendidikanList.map(p => (
                            <PendidikanEntry key={p.id} pendidikan={p} onUpdate={handleUpdate} onRemove={handleRemove} />
                        ))}
                    </div>
                     <button type="button" onClick={handleAdd} className="mt-6 flex items-center text-sm text-secondary hover:text-primary">
                        <PlusCircleIcon className="w-5 h-5 mr-1" />
                        Tambah Riwayat Pendidikan
                    </button>
                </Card>
                <div className="mt-6 flex justify-end space-x-3">
                    {feedback && <p className={`text-sm ${feedback.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{feedback.message}</p>}
                    <Button type="button" variant="secondary" onClick={fetchData}>Batal</Button>
                    <Button type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
                </div>
            </form>
        </Layout>
    );
};

export default DataPendidikanPage;
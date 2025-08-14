
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../components/Layout';
import { Card, InputField, MultiInputField, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/mockApi';
import { Keluarga } from '../../types';

const DataKeluargaPage: React.FC = () => {
    const { user } = useAuth();
    const [keluarga, setKeluarga] = useState<Keluarga | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const fetchData = useCallback(async () => {
        if (user?.pegawaiId) {
            setLoading(true);
            try {
                const data = await api.getPegawaiById(user.pegawaiId);
                if (data) {
                    setKeluarga(data.keluarga);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
                setFeedback({type: 'error', message: 'Gagal memuat data keluarga.'});
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handlePasanganChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (keluarga) {
            setKeluarga({ ...keluarga, pasangan: { ...keluarga.pasangan, [e.target.name]: e.target.value } });
        }
    };

    const handleAnakChange = (anak: { id: string, nama: string }[]) => {
        if (keluarga) {
            setKeluarga({ ...keluarga, anak });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!keluarga || !user?.pegawaiId) return;
        
        setSaving(true);
        setFeedback(null);
        try {
            await api.updateKeluarga(user.pegawaiId, keluarga);
            setFeedback({type: 'success', message: 'Data keluarga berhasil disimpan!'});
        } catch (error) {
            setFeedback({type: 'error', message: 'Gagal menyimpan data keluarga.'});
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) return <Layout><div>Memuat data...</div></Layout>;
    if (!keluarga) return <Layout><div>Data tidak ditemukan.</div></Layout>;

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <Card title="Data Keluarga">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-dark">Suami / Istri</h3>
                             <div className="mt-2">
                                <InputField label="Nama" name="nama" value={keluarga.pasangan.nama} onChange={handlePasanganChange} />
                            </div>
                        </div>
                        <div className="border-t pt-6">
                            <h3 className="text-lg font-medium text-dark">Anak</h3>
                             <div className="mt-2">
                                <MultiInputField label="Nama Anak" values={keluarga.anak} onChange={handleAnakChange} />
                            </div>
                        </div>
                    </div>
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

export default DataKeluargaPage;

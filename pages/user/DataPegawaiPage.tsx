
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from '../../components/Layout';
import { Card, InputField, SelectField, TextAreaField, FileUpload, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../services/mockApi';
import { Pegawai } from '../../types';
import { AGAMA_OPTIONS, JENIS_KELAMIN_OPTIONS, STATUS_PERKAWINAN_OPTIONS } from '../../constants';

const DataPegawaiPage: React.FC = () => {
    const { user } = useAuth();
    const [pegawai, setPegawai] = useState<Pegawai | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [ktpFile, setKtpFile] = useState<File | null>(null);
    const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

    const fetchData = useCallback(async () => {
        if (user?.pegawaiId) {
            setLoading(true);
            try {
                const data = await api.getPegawaiById(user.pegawaiId);
                setPegawai(data);
            } catch (error) {
                console.error("Failed to fetch data", error);
                setFeedback({type: 'error', message: 'Gagal memuat data.'});
            } finally {
                setLoading(false);
            }
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (pegawai) {
            setPegawai({ ...pegawai, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pegawai) return;
        
        setSaving(true);
        setFeedback(null);
        try {
            // In a real app, you would upload the file here and get a URL
            if (ktpFile) {
                pegawai.fotoKtpUrl = URL.createObjectURL(ktpFile);
            }
            await api.updatePegawai(pegawai);
            setFeedback({type: 'success', message: 'Data berhasil disimpan!'});
        } catch (error) {
            setFeedback({type: 'error', message: 'Gagal menyimpan data.'});
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Layout><div>Memuat data...</div></Layout>;
    if (!pegawai) return <Layout><div>Data tidak ditemukan.</div></Layout>;

    return (
        <Layout>
            <form onSubmit={handleSubmit}>
                <Card title="Data Pribadi Pegawai">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="Nama" name="nama" value={pegawai.nama} onChange={handleChange} required />
                        <InputField label="NIK" name="nik" value={pegawai.nik} onChange={handleChange} required />
                        <InputField label="Tempat Lahir" name="tempatLahir" value={pegawai.tempatLahir} onChange={handleChange} />
                        <InputField label="Tanggal Lahir" name="tanggalLahir" type="date" value={pegawai.tanggalLahir} onChange={handleChange} />
                        <SelectField label="Jenis Kelamin" name="jenisKelamin" value={pegawai.jenisKelamin} options={JENIS_KELAMIN_OPTIONS} onChange={handleChange} />
                        <SelectField label="Agama" name="agama" value={pegawai.agama} options={AGAMA_OPTIONS} onChange={handleChange} />
                        <InputField label="Email" name="email" type="email" value={pegawai.email} onChange={handleChange} />
                        <InputField label="Nomor Telepon" name="nomorTelepon" value={pegawai.nomorTelepon} onChange={handleChange} />
                        <SelectField label="Status Perkawinan" name="statusPerkawinan" value={pegawai.statusPerkawinan} options={STATUS_PERKAWINAN_OPTIONS} onChange={handleChange} />
                        <TextAreaField label="Alamat" name="alamat" value={pegawai.alamat} onChange={handleChange} className="md:col-span-2" />
                        <FileUpload label="Upload Foto KTP" id="fotoKtp" onChange={setKtpFile} previewUrl={pegawai.fotoKtpUrl} />
                    </div>
                </Card>

                <Card title="Data Kepegawaian" className="mt-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField label="NIP" name="nip" value={pegawai.nip} onChange={handleChange} />
                        <InputField label="Jabatan" name="jabatan" value={pegawai.jabatan} onChange={handleChange} />
                        <InputField label="Golongan" name="golongan" value={pegawai.golongan} onChange={handleChange} />
                        <InputField label="Pangkat" name="pangkat" value={pegawai.pangkat} onChange={handleChange} />
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

export default DataPegawaiPage;

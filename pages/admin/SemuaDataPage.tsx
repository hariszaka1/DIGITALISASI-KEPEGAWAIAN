import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout } from '../../components/Layout';
import { Card, InputField, SelectField, Button, Modal, TextAreaField } from '../../components/ui';
import { api } from '../../services/mockApi';
import { Pegawai } from '../../types';
import { EyeIcon, EditIcon, TrashIcon, PlusCircleIcon } from '../../components/icons';
import { AGAMA_OPTIONS, JENIS_KELAMIN_OPTIONS, STATUS_PERKAWINAN_OPTIONS } from '../../constants';

const emptyPegawaiData: Omit<Pegawai, 'id'|'keluarga'|'pendidikan'|'fotoKtpUrl'> = {
    nama: '',
    nik: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    email: '',
    nomorTelepon: '',
    statusPerkawinan: 'Belum Kawin',
    alamat: '',
    nip: '',
    jabatan: '',
    golongan: '',
    pangkat: '',
};

const SemuaDataPage: React.FC = () => {
    const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterJabatan, setFilterJabatan] = useState('');
    const [filterGolongan, setFilterGolongan] = useState('');

    const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
    const [editingPegawai, setEditingPegawai] = useState<Pegawai | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // State for Add Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newPegawai, setNewPegawai] = useState(emptyPegawaiData);
    const [newUserAccount, setNewUserAccount] = useState({ username: '', password: '' });


    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getAllPegawai();
            setPegawaiList(data);
        } catch (error) {
            console.error("Failed to fetch pegawai list", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const uniqueJabatan = useMemo(() => [...new Set(pegawaiList.map(p => p.jabatan))], [pegawaiList]);
    const uniqueGolongan = useMemo(() => [...new Set(pegawaiList.map(p => p.golongan))], [pegawaiList]);

    const filteredPegawai = useMemo(() => {
        return pegawaiList.filter(p => {
            const term = searchTerm.toLowerCase();
            const matchesSearch = term === '' || 
                p.nama.toLowerCase().includes(term) ||
                p.nik.includes(term) ||
                p.nip.includes(term);
            const matchesJabatan = filterJabatan === '' || p.jabatan === filterJabatan;
            const matchesGolongan = filterGolongan === '' || p.golongan === filterGolongan;

            return matchesSearch && matchesJabatan && matchesGolongan;
        });
    }, [pegawaiList, searchTerm, filterJabatan, filterGolongan]);

    const handleView = (pegawai: Pegawai) => {
        setSelectedPegawai(pegawai);
        setIsViewModalOpen(true);
    };

    const handleEdit = (pegawai: Pegawai) => {
        setEditingPegawai({ ...pegawai });
        setIsEditModalOpen(true);
    };

    const handleDelete = async (pegawaiId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus data pegawai ini? Tindakan ini juga akan menghapus akun pengguna terkait.')) {
            try {
                await api.deletePegawai(pegawaiId);
                fetchData(); // Refresh the list
            } catch (error) {
                console.error("Failed to delete pegawai", error);
                alert('Gagal menghapus data.');
            }
        }
    };
    
    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (editingPegawai) {
            setEditingPegawai({ ...editingPegawai, [e.target.name]: e.target.value });
        }
    };

    const handleEditSubmit = async () => {
        if (!editingPegawai) return;
        setSaving(true);
        try {
            await api.updatePegawai(editingPegawai);
            setIsEditModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Failed to update pegawai", error);
            alert('Gagal menyimpan perubahan.');
        } finally {
            setSaving(false);
        }
    };

    const openAddModal = () => {
        setNewPegawai(emptyPegawaiData);
        setNewUserAccount({ username: '', password: '' });
        setIsAddModalOpen(true);
    };

    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setNewPegawai({ ...newPegawai, [e.target.name]: e.target.value });
    };

    const handleAddUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewUserAccount({ ...newUserAccount, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async () => {
        if (!newPegawai.nama || !newPegawai.nik) {
            alert('Nama dan NIK wajib diisi.');
            return;
        }
        setSaving(true);
        try {
            const userDetails = (newUserAccount.username && newUserAccount.password) ? newUserAccount : undefined;
            await api.addPegawai(newPegawai, userDetails);
            setIsAddModalOpen(false);
            fetchData();
        } catch (error) {
            console.error("Failed to add pegawai", error);
            alert('Gagal menambah data pegawai baru.');
        } finally {
            setSaving(false);
        }
    };


    if (loading) return <Layout><div>Memuat data pegawai...</div></Layout>;

    return (
        <Layout>
            <Card title="Filter Data Pegawai">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <InputField 
                        label="Cari (Nama, NIK, NIP)" 
                        placeholder="Ketik untuk mencari..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <SelectField 
                        label="Filter by Jabatan"
                        value={filterJabatan}
                        onChange={(e) => setFilterJabatan(e.target.value)}
                        options={uniqueJabatan}
                    />
                    <SelectField 
                        label="Filter by Golongan"
                        value={filterGolongan}
                        onChange={(e) => setFilterGolongan(e.target.value)}
                        options={uniqueGolongan}
                    />
                </div>
            </Card>

            <div className="mt-6">
                 <Card>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{`Menampilkan ${filteredPegawai.length} dari ${pegawaiList.length} Pegawai`}</h3>
                        <Button onClick={openAddModal} className="flex items-center">
                            <PlusCircleIcon className="w-5 h-5 mr-2" />
                            Tambah Pegawai
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIP</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jabatan</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Golongan</th>
                                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredPegawai.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="py-4 px-6 whitespace-nowrap">{p.nama}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{p.nip}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{p.jabatan}</td>
                                        <td className="py-4 px-6 whitespace-nowrap">{p.golongan}</td>
                                        <td className="py-4 px-6 whitespace-nowrap text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button onClick={() => handleView(p)} className="text-blue-500 hover:text-blue-700" title="Lihat Detail"><EyeIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleEdit(p)} className="text-green-500 hover:text-green-700" title="Edit"><EditIcon className="w-5 h-5"/></button>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700" title="Hapus"><TrashIcon className="w-5 h-5"/></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* View Modal */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detail Data Pegawai">
                {selectedPegawai && (
                    <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                        <h3 className="text-lg font-bold text-dark border-b pb-2">Data Pribadi</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p><strong>Nama:</strong> {selectedPegawai.nama}</p>
                            <p><strong>NIK:</strong> {selectedPegawai.nik}</p>
                            <p><strong>Tempat Lahir:</strong> {selectedPegawai.tempatLahir}</p>
                            <p><strong>Tgl Lahir:</strong> {selectedPegawai.tanggalLahir}</p>
                            <p><strong>Jenis Kelamin:</strong> {selectedPegawai.jenisKelamin}</p>
                            <p><strong>Agama:</strong> {selectedPegawai.agama}</p>
                            <p><strong>Email:</strong> {selectedPegawai.email}</p>
                            <p><strong>Telepon:</strong> {selectedPegawai.nomorTelepon}</p>
                            <p><strong>Status Kawin:</strong> {selectedPegawai.statusPerkawinan}</p>
                            <p className="col-span-2"><strong>Alamat:</strong> {selectedPegawai.alamat}</p>
                        </div>

                        <h3 className="text-lg font-bold text-dark border-b pb-2 pt-4">Data Kepegawaian</h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <p><strong>NIP:</strong> {selectedPegawai.nip}</p>
                            <p><strong>Jabatan:</strong> {selectedPegawai.jabatan}</p>
                            <p><strong>Golongan:</strong> {selectedPegawai.golongan}</p>
                            <p><strong>Pangkat:</strong> {selectedPegawai.pangkat}</p>
                        </div>

                        <h3 className="text-lg font-bold text-dark border-b pb-2 pt-4">Data Keluarga</h3>
                        <div className="text-sm">
                            <p><strong>Pasangan:</strong> {selectedPegawai.keluarga.pasangan.nama || 'N/A'}</p>
                            <p><strong>Anak:</strong></p>
                            {selectedPegawai.keluarga.anak.length > 0 ? (
                                <ul className="list-disc list-inside ml-4">
                                    {selectedPegawai.keluarga.anak.map(a => <li key={a.id}>{a.nama}</li>)}
                                </ul>
                            ) : <p className="ml-4">-</p>}
                        </div>

                        <h3 className="text-lg font-bold text-dark border-b pb-2 pt-4">Riwayat Pendidikan</h3>
                        <div className="space-y-2 text-sm">
                            {selectedPegawai.pendidikan.map(p => (
                                <div key={p.id}>
                                    <p><strong>{p.tingkat}:</strong> {p.namaSekolah} ({p.tahunMasuk} - {p.tahunLulus})</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Edit Modal */}
            <Modal 
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                title="Edit Data Pegawai"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
                        <Button onClick={handleEditSubmit} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
                    </>
                }
            >
                {editingPegawai && (
                    <form className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                        <Card>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Nama" name="nama" value={editingPegawai.nama} onChange={handleEditChange} required />
                                <InputField label="NIK" name="nik" value={editingPegawai.nik} onChange={handleEditChange} required />
                                <InputField label="Tempat Lahir" name="tempatLahir" value={editingPegawai.tempatLahir} onChange={handleEditChange} />
                                <InputField label="Tanggal Lahir" name="tanggalLahir" type="date" value={editingPegawai.tanggalLahir} onChange={handleEditChange} />
                                <SelectField label="Jenis Kelamin" name="jenisKelamin" value={editingPegawai.jenisKelamin} options={JENIS_KELAMIN_OPTIONS} onChange={handleEditChange} />
                                <SelectField label="Agama" name="agama" value={editingPegawai.agama} options={AGAMA_OPTIONS} onChange={handleEditChange} />
                                <InputField label="Email" name="email" type="email" value={editingPegawai.email} onChange={handleEditChange} />
                                <InputField label="Nomor Telepon" name="nomorTelepon" value={editingPegawai.nomorTelepon} onChange={handleEditChange} />
                                <SelectField label="Status Perkawinan" name="statusPerkawinan" value={editingPegawai.statusPerkawinan} options={STATUS_PERKAWINAN_OPTIONS} onChange={handleEditChange} />
                                <TextAreaField label="Alamat" name="alamat" value={editingPegawai.alamat} onChange={handleEditChange} className="md:col-span-2" />
                            </div>
                        </Card>
                        <Card className="mt-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="NIP" name="nip" value={editingPegawai.nip} onChange={handleEditChange} />
                                <InputField label="Jabatan" name="jabatan" value={editingPegawai.jabatan} onChange={handleEditChange} />
                                <InputField label="Golongan" name="golongan" value={editingPegawai.golongan} onChange={handleEditChange} />
                                <InputField label="Pangkat" name="pangkat" value={editingPegawai.pangkat} onChange={handleEditChange} />
                            </div>
                        </Card>
                    </form>
                )}
            </Modal>

            {/* Add Modal */}
            <Modal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                title="Tambah Data Pegawai Baru"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Batal</Button>
                        <Button onClick={handleAddSubmit} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
                    </>
                }
            >
                <form className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
                    <Card title="Data Pribadi & Kepegawaian">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Nama" name="nama" value={newPegawai.nama} onChange={handleAddChange} required />
                            <InputField label="NIK" name="nik" value={newPegawai.nik} onChange={handleAddChange} required />
                            <InputField label="Tempat Lahir" name="tempatLahir" value={newPegawai.tempatLahir} onChange={handleAddChange} />
                            <InputField label="Tanggal Lahir" name="tanggalLahir" type="date" value={newPegawai.tanggalLahir} onChange={handleAddChange} />
                            <SelectField label="Jenis Kelamin" name="jenisKelamin" value={newPegawai.jenisKelamin} options={JENIS_KELAMIN_OPTIONS} onChange={handleAddChange} />
                            <SelectField label="Agama" name="agama" value={newPegawai.agama} options={AGAMA_OPTIONS} onChange={handleAddChange} />
                            <InputField label="Email" name="email" type="email" value={newPegawai.email} onChange={handleAddChange} />
                            <InputField label="Nomor Telepon" name="nomorTelepon" value={newPegawai.nomorTelepon} onChange={handleAddChange} />
                            <SelectField label="Status Perkawinan" name="statusPerkawinan" value={newPegawai.statusPerkawinan} options={STATUS_PERKAWINAN_OPTIONS} onChange={handleAddChange} />
                            <TextAreaField label="Alamat" name="alamat" value={newPegawai.alamat} onChange={handleAddChange} className="md:col-span-2" />
                            <InputField label="NIP" name="nip" value={newPegawai.nip} onChange={handleAddChange} />
                            <InputField label="Jabatan" name="jabatan" value={newPegawai.jabatan} onChange={handleAddChange} />
                            <InputField label="Golongan" name="golongan" value={newPegawai.golongan} onChange={handleAddChange} />
                            <InputField label="Pangkat" name="pangkat" value={newPegawai.pangkat} onChange={handleAddChange} />
                        </div>
                    </Card>
                    <Card title="Buat Akun Pengguna (Opsional)">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InputField label="Username" name="username" value={newUserAccount.username} onChange={handleAddUserChange} />
                            <InputField label="Password" name="password" type="password" value={newUserAccount.password} onChange={handleAddUserChange} />
                        </div>
                    </Card>
                </form>
            </Modal>
        </Layout>
    );
};

export default SemuaDataPage;
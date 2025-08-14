import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout } from '../../components/Layout';
import { Card, Button, Modal, InputField, SelectField } from '../../components/ui';
import { api } from '../../services/mockApi';
import { UserAccount, Role, Pegawai } from '../../types';
import { EditIcon, TrashIcon } from '../../components/icons';

const ManajemenUserPage: React.FC = () => {
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [allPegawai, setAllPegawai] = useState<Pegawai[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: Role.USER, pegawaiId: '' });
    
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
             const [userData, pegawaiData] = await Promise.all([
                api.getAllUsers(),
                api.getAllPegawai(),
            ]);
            setUsers(userData);
            setAllPegawai(pegawaiData);
        } catch (error) {
            console.error("Failed to load management data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const pegawaiMap = useMemo(() => {
        return allPegawai.reduce((map, p) => {
            map[p.id] = p.nama;
            return map;
        }, {} as Record<string, string>);
    }, [allPegawai]);
    
    const unassignedPegawai = useMemo(() => {
        const assignedPegawaiIds = new Set(users.map(u => u.pegawaiId).filter(Boolean));
        return allPegawai.filter(p => !assignedPegawaiIds.has(p.id));
    }, [users, allPegawai]);

    const handleAddUser = async () => {
        if (!newUser.username || !newUser.password) {
            alert("Username and password are required.");
            return;
        }
        await api.addUser(newUser);
        setIsModalOpen(false);
        setNewUser({ username: '', password: '', role: Role.USER, pegawaiId: '' });
        fetchData(); // Refresh list
    };
    
    const handleDeleteUser = async (userId: string) => {
        if(window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            await api.deleteUser(userId);
            fetchData();
        }
    }

    const handleResetPassword = (username: string) => {
        alert(`Password untuk user ${username} telah di-reset (simulasi).`);
    }

    if (loading) return <Layout><div>Memuat data pengguna...</div></Layout>;

    return (
        <Layout>
            <Card title="Manajemen Pengguna Sistem">
                <div className="mb-4 flex justify-end">
                    <Button onClick={() => setIsModalOpen(true)}>Tambah User Baru</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-black uppercase tracking-wider">Username</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-black uppercase tracking-wider">Role</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-black uppercase tracking-wider">Pegawai Terhubung</th>
                                <th className="py-3 px-6 text-center text-xs font-medium text-black uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-black">
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-6">{user.username}</td>
                                    <td className="py-4 px-6 capitalize">{user.role}</td>
                                    <td className="py-4 px-6">{pegawaiMap[user.pegawaiId] || 'N/A'}</td>
                                    <td className="py-4 px-6 text-center">
                                        <div className="flex justify-center space-x-2">
                                            <button onClick={() => handleResetPassword(user.username)} className="text-green-500 hover:text-green-700" title="Reset Password"><EditIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700" title="Hapus User"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Tambah User Baru"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Batal</Button>
                        <Button onClick={handleAddUser}>Simpan</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <InputField
                        label="Username"
                        value={newUser.username}
                        onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                        required
                    />
                    <InputField
                        label="Password"
                        type="password"
                        value={newUser.password}
                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                        required
                    />
                    <SelectField
                        label="Role"
                        value={newUser.role}
                        onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                        options={Object.values(Role)}
                    />
                    <SelectField
                        label="Hubungkan ke Pegawai (opsional)"
                        value={newUser.pegawaiId}
                        onChange={e => setNewUser({ ...newUser, pegawaiId: e.target.value })}
                    >
                        <option value="">Tidak terhubung</option>
                        {unassignedPegawai.map(p => (
                             <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                    </SelectField>
                </div>
            </Modal>
        </Layout>
    );
};

export default ManajemenUserPage;
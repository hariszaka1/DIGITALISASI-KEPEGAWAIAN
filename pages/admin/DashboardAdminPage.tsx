
import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { Card } from '../../components/ui';
import { api } from '../../services/mockApi';
import { Pegawai } from '../../types';
import { UsersIcon, UserIcon, GraduationCapIcon } from '../../components/icons';

// --- Component Definitions ---

// StatCard Component
const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <Card className="flex items-center p-4 transition-transform transform hover:scale-105">
        <div className="p-3 rounded-full bg-secondary text-white mr-4">
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-dark">{value}</p>
        </div>
    </Card>
);

// BarChart Component for data visualization
const BarChart: React.FC<{ data: { label: string; value: number }[] }> = ({ data }) => {
    if (!data.length) {
        return <p className="text-center text-gray-500 py-8">Tidak ada data untuk ditampilkan.</p>;
    }
    
    const maxValue = Math.max(...data.map(item => item.value), 1); // Avoid division by zero

    return (
        <div className="w-full h-72 p-4 flex justify-around items-end gap-x-2 md:gap-x-4 border-t mt-4">
            {data.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="relative w-full h-full flex items-end justify-center">
                         <div
                            className="w-3/4 bg-violet-300 rounded-t-md transition-all duration-300 ease-in-out group-hover:bg-secondary"
                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                        >
                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-dark opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.value}
                            </span>
                         </div>
                    </div>
                    <p className="text-center text-xs text-gray-600 mt-2 truncate w-full">{item.label}</p>
                </div>
            ))}
        </div>
    );
};

// --- Page Component ---

const DashboardAdminPage: React.FC = () => {
    const [stats, setStats] = useState({ pegawai: 0, users: 0, jabatan: 0 });
    const [pegawaiTerbaru, setPegawaiTerbaru] = useState<Pegawai[]>([]);
    const [jabatanData, setJabatanData] = useState<{label: string, value: number}[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const [pegawaiData, usersData] = await Promise.all([
                    api.getAllPegawai(),
                    api.getAllUsers(),
                ]);
                
                // Set stats
                const uniqueJabatanCount = new Set(pegawaiData.map(p => p.jabatan)).size;
                setStats({
                    pegawai: pegawaiData.length,
                    users: usersData.length,
                    jabatan: uniqueJabatanCount,
                });

                // Set data for bar chart (employee distribution by position)
                const jabatanCounts = pegawaiData.reduce((acc, p) => {
                    acc[p.jabatan] = (acc[p.jabatan] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                const chartData = Object.entries(jabatanCounts)
                    .map(([label, value]) => ({ label, value }))
                    .sort((a,b) => b.value - a.value); // Sort for better visualization
                
                setJabatanData(chartData);
                
                // Set latest employees
                setPegawaiTerbaru(pegawaiData.slice(0, 5));

            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return <Layout><div>Memuat dashboard...</div></Layout>
    }

    return (
        <Layout>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Pegawai" value={stats.pegawai} icon={UsersIcon} />
                <StatCard title="Total Pengguna" value={stats.users} icon={UserIcon} />
                <StatCard title="Total Jabatan" value={stats.jabatan} icon={GraduationCapIcon} />
            </div>

            {/* Main Dashboard Area with Charts and Lists */}
            <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">
                
                {/* Left side: Bar Chart */}
                <div className="xl:col-span-2">
                    <Card title="Distribusi Pegawai per Jabatan">
                        <BarChart data={jabatanData} />
                    </Card>
                </div>

                {/* Right side: Latest Employees */}
                <div className="xl:col-span-1">
                    <Card title="Pegawai Terbaru">
                        <ul className="space-y-3 mt-4">
                            {pegawaiTerbaru.length > 0 ? pegawaiTerbaru.map(p => (
                                <li key={p.id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
                                    <div className="flex items-center">
                                         <div className="w-10 h-10 rounded-full bg-violet-100 text-primary flex items-center justify-center font-bold mr-3">
                                            {p.nama.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-dark text-sm">{p.nama}</p>
                                            <p className="text-xs text-gray-500">{p.jabatan}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-medium bg-gray-200 text-gray-700 px-2 py-1 rounded-full">{p.golongan}</span>
                                </li>
                            )) : <p className="text-center text-gray-500 py-4">Belum ada pegawai.</p>}
                        </ul>
                    </Card>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardAdminPage;
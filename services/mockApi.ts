import { Pegawai, User, Role, UserAccount, Pendidikan, Keluarga } from '../types';

let mockPegawaiData: Pegawai[] = [
  {
    id: 'pegawai-1',
    nama: 'Budi Santoso',
    nik: '3201234567890001',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1990-05-15',
    jenisKelamin: 'Laki-laki',
    agama: 'Islam',
    email: 'budi.santoso@example.com',
    nomorTelepon: '081234567890',
    statusPerkawinan: 'Kawin',
    alamat: 'Jl. Merdeka No. 10, Jakarta Pusat',
    fotoKtpUrl: 'https://picsum.photos/seed/ktp1/400/300',
    nip: '199005152015031001',
    jabatan: 'Staff IT',
    golongan: 'III/a',
    pangkat: 'Penata Muda',
    keluarga: {
      pasangan: { nama: 'Siti Aminah' },
      anak: [
        { id: 'anak-1', nama: 'Adi Santoso' },
        { id: 'anak-2', nama: 'Ani Santoso' },
      ],
    },
    pendidikan: [
      { id: 'pend-1', tingkat: 'Universitas', namaSekolah: 'Universitas Indonesia', tahunMasuk: '2008', tahunLulus: '2012', noIjazah: 'UI-12345', fotoIjazahUrl: 'https://picsum.photos/seed/ijazah1/400/500' },
      { id: 'pend-2', tingkat: 'SMA', namaSekolah: 'SMA Negeri 1 Jakarta', tahunMasuk: '2005', tahunLulus: '2008', noIjazah: 'SMA-67890' },
    ],
  },
  {
    id: 'pegawai-2',
    nama: 'Rina Wijaya',
    nik: '3201234567890002',
    tempatLahir: 'Bandung',
    tanggalLahir: '1992-08-20',
    jenisKelamin: 'Perempuan',
    agama: 'Kristen Protestan',
    email: 'rina.wijaya@example.com',
    nomorTelepon: '081298765432',
    statusPerkawinan: 'Belum Kawin',
    alamat: 'Jl. Asia Afrika No. 5, Bandung',
    fotoKtpUrl: 'https://picsum.photos/seed/ktp2/400/300',
    nip: '199208202018032001',
    jabatan: 'Analis Keuangan',
    golongan: 'III/b',
    pangkat: 'Penata Muda Tk. I',
     keluarga: {
      pasangan: { nama: '' },
      anak: [],
    },
    pendidikan: [
      { id: 'pend-3', tingkat: 'Universitas', namaSekolah: 'Institut Teknologi Bandung', tahunMasuk: '2010', tahunLulus: '2014', noIjazah: 'ITB-54321', fotoIjazahUrl: 'https://picsum.photos/seed/ijazah2/400/500' },
    ],
  },
];

let mockUsers: (UserAccount & { password?: string })[] = [
  { id: 'user-1', username: 'budi', password: 'budi', role: Role.USER, pegawaiId: 'pegawai-1' },
  { id: 'user-2', username: 'rina', password: 'rina', role: Role.USER, pegawaiId: 'pegawai-2' },
  { id: 'user-admin', username: 'admin', password: 'admin', role: Role.ADMIN, pegawaiId: '' },
];

const simulateDelay = <T,>(data: T): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), 500));


export const api = {
  login: async (username: string, password: string): Promise<{ token: string; user: User } | null> => {
    const userAccount = mockUsers.find(u => u.username === username && u.password === password);
    if (userAccount) {
      const user: User = {
        id: userAccount.id,
        username: userAccount.username,
        role: userAccount.role,
        pegawaiId: userAccount.pegawaiId,
      };
      return simulateDelay({ token: `mock-jwt-for-${username}`, user });
    }
    return simulateDelay(null);
  },

  register: async (nama: string, username: string, password: string): Promise<{ token: string; user: User } | { error: string }> => {
    const existingUser = mockUsers.find(u => u.username === username);
    if (existingUser) {
      return { error: 'Username sudah digunakan.' };
    }

    const newPegawai: Pegawai = {
      id: `pegawai-${Date.now()}`,
      nama,
      nik: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: 'Laki-laki',
      agama: 'Islam',
      email: '',
      nomorTelepon: '',
      statusPerkawinan: 'Belum Kawin',
      alamat: '',
      fotoKtpUrl: '',
      nip: '',
      jabatan: 'Pegawai Baru',
      golongan: '',
      pangkat: '',
      keluarga: {
        pasangan: { nama: '' },
        anak: [],
      },
      pendidikan: [],
    };

    mockPegawaiData.unshift(newPegawai);

    const newUserAccount: UserAccount & { password?: string } = {
      id: `user-${Date.now()}`,
      username,
      password,
      role: Role.USER,
      pegawaiId: newPegawai.id,
    };
    mockUsers.push(newUserAccount);

    const user: User = {
      id: newUserAccount.id,
      username: newUserAccount.username,
      role: newUserAccount.role,
      pegawaiId: newUserAccount.pegawaiId,
    };

    return simulateDelay({ token: `mock-jwt-for-${username}`, user });
  },

  getPegawaiById: async (id: string): Promise<Pegawai | null> => {
    const pegawai = mockPegawaiData.find(p => p.id === id);
    return simulateDelay(pegawai || null);
  },

  getAllPegawai: async (): Promise<Pegawai[]> => {
    return simulateDelay(mockPegawaiData);
  },

  updatePegawai: async (data: Pegawai): Promise<Pegawai> => {
    const index = mockPegawaiData.findIndex(p => p.id === data.id);
    if (index !== -1) {
      mockPegawaiData[index] = data;
    }
    return simulateDelay(data);
  },
  
  updateKeluarga: async(pegawaiId: string, data: Keluarga): Promise<boolean> => {
    const index = mockPegawaiData.findIndex(p => p.id === pegawaiId);
    if (index !== -1) {
      mockPegawaiData[index].keluarga = data;
    }
    return simulateDelay(true);
  },
  
  updatePendidikan: async(pegawaiId: string, data: Pendidikan[]): Promise<boolean> => {
    const index = mockPegawaiData.findIndex(p => p.id === pegawaiId);
    if (index !== -1) {
      mockPegawaiData[index].pendidikan = data;
    }
    return simulateDelay(true);
  },

  deletePegawai: async (pegawaiId: string): Promise<boolean> => {
    const initialLength = mockPegawaiData.length;
    mockPegawaiData = mockPegawaiData.filter(p => p.id !== pegawaiId);
    // Also remove the associated user account to prevent orphaned users
    mockUsers = mockUsers.filter(u => u.pegawaiId !== pegawaiId);
    return simulateDelay(mockPegawaiData.length < initialLength);
  },

  addPegawai: async (
    data: Omit<Pegawai, 'id' | 'keluarga' | 'pendidikan' | 'fotoKtpUrl'>,
    userDetails?: { username: string, password: string }
  ): Promise<Pegawai> => {
    const newPegawai: Pegawai = {
      ...data,
      id: `pegawai-${Date.now()}`,
      keluarga: {
        pasangan: { nama: '' },
        anak: [],
      },
      pendidikan: [],
      fotoKtpUrl: '',
    };
    mockPegawaiData.unshift(newPegawai);

    if (userDetails && userDetails.username && userDetails.password) {
      const newUserAccount: UserAccount & { password?: string } = {
        id: `user-${Date.now()}`,
        username: userDetails.username,
        password: userDetails.password,
        role: Role.USER,
        pegawaiId: newPegawai.id,
      };
      mockUsers.push(newUserAccount);
    }

    return simulateDelay(newPegawai);
  },

  getAllUsers: async (): Promise<UserAccount[]> => {
    return simulateDelay(mockUsers);
  },

  addUser: async (newUser: Omit<UserAccount, 'id'> & { password?: string }): Promise<UserAccount> => {
    const newUserAccount: UserAccount & { password?: string } = {
      ...newUser,
      id: `user-${Date.now()}`,
    };
    mockUsers.push(newUserAccount);
    return simulateDelay(newUserAccount);
  },
  
  deleteUser: async (userId: string): Promise<boolean> => {
    mockUsers = mockUsers.filter(u => u.id !== userId);
    return simulateDelay(true);
  },
};
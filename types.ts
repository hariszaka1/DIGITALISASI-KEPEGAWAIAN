
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

export interface User {
  id: string;
  username: string;
  role: Role;
  pegawaiId: string;
}

export interface Pendidikan {
  id: string;
  tingkat: 'SD' | 'SMP' | 'SMA' | 'Universitas';
  namaSekolah: string;
  tahunMasuk: string;
  tahunLulus: string;
  noIjazah: string;
  fotoIjazahUrl?: string;
}

export interface Keluarga {
  pasangan: {
    nama: string;
  };
  anak: { id: string; nama: string }[];
}

export interface Pegawai {
  id: string;
  nama: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  agama: string;
  email: string;
  nomorTelepon: string;
  statusPerkawinan: 'Belum Kawin' | 'Kawin' | 'Cerai Hidup' | 'Cerai Mati';
  alamat: string;
  fotoKtpUrl?: string;
  nip: string;
  jabatan: string;
  golongan: string;
  pangkat: string;
  keluarga: Keluarga;
  pendidikan: Pendidikan[];
}

export interface UserAccount {
  id: string;
  username: string;
  role: Role;
  pegawaiId: string;
}

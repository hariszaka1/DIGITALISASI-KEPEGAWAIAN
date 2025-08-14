import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/mockApi';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';
import { InputField, Button } from '../components/ui';

const LoginPage: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.login(username, password);
      if (response) {
        auth.login(response.user, response.token);
        if (response.user.role === Role.ADMIN) {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/data-pegawai');
        }
      } else {
        setError('Username atau password salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await api.register(nama, username, password);
      if (response && 'token' in response) {
        auth.login(response.user, response.token);
        navigate('/user/data-pegawai');
      } else if (response && 'error' in response) {
        setError(response.error);
      } else {
        setError('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
      }
    } catch (err) {
       setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        setLoading(false);
    }
  };

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setUsername('');
    setPassword('');
    setNama('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-2xl rounded-xl p-8">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-extrabold text-primary">DIAN</h1>
                <p className="text-gray-500 mt-2">Digitalisasi Kepegawaian</p>
            </div>

            {isRegistering ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <h2 className="text-xl font-bold text-center text-dark mb-4">Registrasi Akun Baru</h2>
                <InputField
                  label="Nama Lengkap" id="nama" type="text"
                  value={nama} onChange={(e) => setNama(e.target.value)}
                  required
                />
                <InputField
                  label="Username" id="username" type="text"
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <InputField
                  label="Password" id="password" type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <InputField
                  label="Konfirmasi Password" id="confirmPassword" type="password"
                  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" className="w-full !mt-6" disabled={loading}>
                  {loading ? 'Memproses...' : 'Daftar'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-6">
                 <h2 className="text-xl font-bold text-center text-dark mb-4">Login</h2>
                <InputField
                  label="Username" id="username" type="text"
                  value={username} onChange={(e) => setUsername(e.target.value)}
                  required autoComplete="username"
                />
                <InputField
                  label="Password" id="password" type="password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required autoComplete="current-password"
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Memproses...' : 'Login'}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <button onClick={toggleForm} className="text-sm text-secondary hover:text-primary hover:underline focus:outline-none">
                {isRegistering ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar sekarang'}
              </button>
            </div>
        </div>
         <p className="text-center text-slate-200 text-xs mt-6">
            © 2024 DIAN. All rights reserved.
            {!isRegistering && (
                <>
                    <br />
                    User: 'budi' (pass: 'budi'), 'rina' (pass: 'rina') | Admin: 'admin' (pass: 'admin')
                </>
            )}
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
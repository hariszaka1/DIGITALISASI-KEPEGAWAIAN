import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { Role } from './types';

// Pages
import LoginPage from './pages/LoginPage';
// User Pages
import DataPegawaiPage from './pages/user/DataPegawaiPage';
import DataKeluargaPage from './pages/user/DataKeluargaPage';
import DataPendidikanPage from './pages/user/DataPendidikanPage';
import PencarianUserPage from './pages/user/PencarianUserPage';
// Admin Pages
import DashboardAdminPage from './pages/admin/DashboardAdminPage';
import SemuaDataPage from './pages/admin/SemuaDataPage';
import ManajemenUserPage from './pages/admin/ManajemenUserPage';
import LaporanExportPage from './pages/admin/LaporanExportPage';

interface ProtectedRouteProps {
  allowedRoles: Role[];
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user && allowedRoles.includes(user.role)) {
    return children;
  }
  
  // If authenticated but wrong role, redirect to login page.
  // The login page will then redirect them to their correct dashboard.
  return <Navigate to="/login" replace />;
};


export const AppRoutes: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      {/* User Routes */}
      <Route path="/user/data-pegawai" element={<ProtectedRoute allowedRoles={[Role.USER]}><DataPegawaiPage /></ProtectedRoute>} />
      <Route path="/user/data-keluarga" element={<ProtectedRoute allowedRoles={[Role.USER]}><DataKeluargaPage /></ProtectedRoute>} />
      <Route path="/user/data-pendidikan" element={<ProtectedRoute allowedRoles={[Role.USER]}><DataPendidikanPage /></ProtectedRoute>} />
      <Route path="/user/pencarian" element={<ProtectedRoute allowedRoles={[Role.USER]}><PencarianUserPage /></ProtectedRoute>} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><DashboardAdminPage /></ProtectedRoute>} />
      <Route path="/admin/semua-data" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><SemuaDataPage /></ProtectedRoute>} />
      <Route path="/admin/manajemen-user" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><ManajemenUserPage /></ProtectedRoute>} />
      <Route path="/admin/laporan" element={<ProtectedRoute allowedRoles={[Role.ADMIN]}><LaporanExportPage /></ProtectedRoute>} />
      
      {/* Default redirect */}
      <Route 
        path="*" 
        element={
          <Navigate to={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/user/data-pegawai") : "/login"} replace />
        }
      />
    </Routes>
  );
};
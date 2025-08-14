
import React, { useState, ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { HomeIcon, UserIcon, FamilyIcon, GraduationCapIcon, SearchIcon, LogOutIcon, UsersIcon, FileTextIcon, MenuIcon } from './icons';
import { Role } from '../types';

const userNavItems = [
  { name: 'Data Pegawai', path: '/user/data-pegawai', icon: UserIcon },
  { name: 'Data Keluarga', path: '/user/data-keluarga', icon: FamilyIcon },
  { name: 'Data Pendidikan', path: '/user/data-pendidikan', icon: GraduationCapIcon },
  { name: 'Pencarian Data', path: '/user/pencarian', icon: SearchIcon },
];

const adminNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
  { name: 'Lihat Semua Data', path: '/admin/semua-data', icon: UsersIcon },
  { name: 'Manajemen User', path: '/admin/manajemen-user', icon: UserIcon },
  { name: 'Laporan & Export', path: '/admin/laporan', icon: FileTextIcon },
];

const NavItem: React.FC<{ to: string; icon: React.ElementType; children: ReactNode }> = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 my-1 rounded-lg transition-colors ${
        isActive ? 'bg-secondary text-white shadow-md' : 'text-gray-200 hover:bg-indigo-600 hover:text-white'
      }`
    }
  >
    <Icon className="w-5 h-5 mr-3" />
    <span className="font-medium">{children}</span>
  </NavLink>
);

const Sidebar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { isAdmin, logout } = useAuth();
  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <aside className={`bg-primary text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out z-30`}>
      <div className="text-white text-2xl font-extrabold text-center">
        DIAN
      </div>
      <nav className="flex-grow">
        <p className="px-4 text-sm text-gray-400 mb-2">MENU UTAMA</p>
        {navItems.map(item => (
          <NavItem key={item.name} to={item.path} icon={item.icon}>
            {item.name}
          </NavItem>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-2 left-0">
        <button
          onClick={logout}
          className="flex items-center p-3 w-full rounded-lg transition-colors text-gray-200 hover:bg-red-600 hover:text-white"
        >
          <LogOutIcon className="w-5 h-5 mr-3" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        const items = isAdmin ? adminNavItems : userNavItems;
        const currentItem = items.find(item => item.path === location.pathname);
        return currentItem?.name || (isAdmin ? 'Admin Dashboard' : 'Dashboard Pengguna');
    }

    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center">
                <button onClick={onMenuClick} className="md:hidden text-gray-600 mr-4">
                    <MenuIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-semibold text-dark">{getPageTitle()}</h1>
            </div>
            <div className="flex items-center">
                <div className="text-right mr-3">
                    <p className="font-semibold text-dark capitalize">{user?.username}</p>
                    <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Pengguna'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-lg">
                    {user?.username.charAt(0).toUpperCase()}
                </div>
            </div>
        </header>
    );
}

export const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-light">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-light p-6">
          {children}
        </main>
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"></div>}
    </div>
  );
};
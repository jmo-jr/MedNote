
import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import AppHeader from '../components/AppHeader';

const MainLayout: React.FC = () => {
  const location = useLocation();

  const getTabClass = (path: string) => {
    const isActive = location.pathname.includes(path);
    return `py-2 px-4 text-sm font-medium text-center border-b-2 ${
      isActive
        ? 'border-med-purple text-med-purple'
        : 'border-transparent text-med-gray-500 hover:text-med-gray-700 hover:border-med-gray-300'
    }`;
  };

  return (
    <div className="flex flex-col h-screen">
      <AppHeader>
        <nav className="flex justify-around border-b border-med-gray-200">
          <NavLink to="/patients" className={getTabClass('/patients')}>
            Meus Pacientes
          </NavLink>
          <NavLink to="/reminders" className={getTabClass('/reminders')}>
            Lembretes
          </NavLink>
        </nav>
      </AppHeader>
      <main className="flex-grow overflow-y-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

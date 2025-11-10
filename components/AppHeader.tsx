
import React from 'react';
import { Link } from 'react-router-dom';
import LogoIcon from './icons/LogoIcon';
import { useData } from '../context/DataContext';

interface AppHeaderProps {
    children?: React.ReactNode;
}

const AppHeader: React.FC<AppHeaderProps> = ({ children }) => {
  const { user } = useData();

  return (
    <header className="sticky top-0 bg-white shadow-sm z-10">
      <div className="p-4 flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center space-x-2">
            <LogoIcon className="h-8 w-8 text-med-gray-800" />
            <h1 className="text-2xl font-bold text-med-gray-800">
              Med<span className="text-med-teal">Note</span>
            </h1>
          </div>
        </Link>
        <Link to="/profile">
          <div className="h-10 w-10 bg-med-gray-300 rounded-full flex items-center justify-center font-bold text-med-gray-600">
            {user.initials}
          </div>
        </Link>
      </div>
      {children}
    </header>
  );
};

export default AppHeader;

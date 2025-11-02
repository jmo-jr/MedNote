
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainLayout from './pages/MainLayout';
import PatientList from './pages/PatientList';
import Reminders from './pages/Reminders';
import PatientDetail from './pages/PatientDetail';
import ConsultationDetail from './pages/ConsultationDetail';
import Profile from './pages/Profile';
import { DataProvider } from './context/DataContext';

const App: React.FC = () => {
  // In a real app, you'd have an auth state. We'll simulate being logged in.
  const [isAuthenticated, setIsAuthenticated] = React.useState(true);

  return (
    <DataProvider>
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="max-w-md mx-auto bg-white shadow-lg min-h-screen">
          <HashRouter>
            <Routes>
              {/* For this simulation, we default to the main app.
                  In a real scenario, you'd protect these routes. */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Navigate to="/patients" replace />} />
                <Route path="patients" element={<PatientList />} />
                <Route path="reminders" element={<Reminders />} />
              </Route>
              <Route path="/patient/:patientId" element={<PatientDetail />} />
              <Route path="/patient/:patientId/consultation/:consultationId" element={<ConsultationDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </DataProvider>
  );
};

export default App;

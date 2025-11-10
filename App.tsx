
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
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <DataProvider>
      <div className="bg-gray-50 min-h-screen font-sans">
        <div className="min-w-xs mx-auto bg-white shadow-lg min-h-screen">
          <HashRouter>
            <Routes>
              {/* For this simulation, we default to the main app.
                  In a real scenario, you'd protect these routes. */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/patients" replace />} />
                <Route path="patients" element={<PatientList />} />
                <Route path="reminders" element={<Reminders />} />
              </Route>
              <Route
                path="/patient/:patientId"
                element={
                  <ProtectedRoute>
                    <PatientDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/patient/:patientId/consultation/:consultationId"
                element={
                  <ProtectedRoute>
                    <ConsultationDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/patients' : '/login'} replace />}
              />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </DataProvider>
  );
};

export default App;

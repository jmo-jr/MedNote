import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_PATIENTS, MOCK_CONSULTATIONS, MOCK_REMINDERS, MOCK_USER } from '../constants';
import type { Patient, Consultation, Reminder, User } from '../types';

// Helper to get data from localStorage or fall back to mock data
const getInitialData = <T,>(key: string, mockData: T[]): T[] => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : mockData;
  } catch (error) {
    console.error(`Error reading from localStorage key “${key}”:`, error);
    return mockData;
  }
};


interface DataContextType {
  user: User;
  patients: Patient[];
  consultations: Consultation[];
  reminders: Reminder[];
  getPatientById: (id: string) => Patient | undefined;
  getConsultationsByPatientId: (patientId: string) => Consultation[];
  getConsultationByIds: (patientId: string, consultationId: string) => Consultation | undefined;
  getReminders: () => Reminder[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patient: Patient) => void;
  addConsultation: (consultation: Omit<Consultation, 'id'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (reminder: Reminder) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => getInitialData('mednote_patients', MOCK_PATIENTS));
  const [consultations, setConsultations] = useState<Consultation[]>(() => getInitialData('mednote_consultations', MOCK_CONSULTATIONS));
  const [reminders, setReminders] = useState<Reminder[]>(() => getInitialData('mednote_reminders', MOCK_REMINDERS));
  const [user] = useState<User>(MOCK_USER);

  useEffect(() => {
    localStorage.setItem('mednote_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('mednote_consultations', JSON.stringify(consultations));
  }, [consultations]);
  
  useEffect(() => {
    localStorage.setItem('mednote_reminders', JSON.stringify(reminders));
  }, [reminders]);


  const getPatientById = (id: string) => patients.find(p => p.id === id);
  
  const getConsultationsByPatientId = (patientId: string) => 
    consultations.filter(c => c.patientId === patientId)
                 .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  
  const getConsultationByIds = (patientId: string, consultationId: string) => 
    consultations.find(c => c.patientId === patientId && c.id === consultationId);

  const getReminders = () => reminders.sort((a,b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = { ...patientData, id: crypto.randomUUID() };
    setPatients(prev => [...prev, newPatient]);
  };
  
  const updatePatient = (updatedPatient: Patient) => {
      setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const addConsultation = (consultationData: Omit<Consultation, 'id'>) => {
      const newConsultation: Consultation = { ...consultationData, id: crypto.randomUUID() };
      setConsultations(prev => [...prev, newConsultation]);
  };

  const addReminder = (reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = { ...reminderData, id: crypto.randomUUID() };
    setReminders(prev => [...prev, newReminder]);
  };
  
  const updateReminder = (updatedReminder: Reminder) => {
      setReminders(prev => prev.map(r => r.id === updatedReminder.id ? updatedReminder : r));
  };


  const value = {
    user,
    patients,
    consultations,
    reminders,
    getPatientById,
    getConsultationsByPatientId,
    getConsultationByIds,
    getReminders,
    addPatient,
    updatePatient,
    addConsultation,
    addReminder,
    updateReminder,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

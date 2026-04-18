import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  type DocumentData,
  type QuerySnapshot,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { MOCK_CONSULTATIONS, MOCK_EXAMS, MOCK_PATIENTS, MOCK_REMINDERS, MOCK_USER } from '../constants';
import { db, isFirebaseConfigured, storage } from '../services/firebase';
import { useAuth } from './AuthContext';
import type { Consultation, Exam, Patient, Reminder, User } from '../types';

interface DataContextType {
  user: User;
  patients: Patient[];
  consultations: Consultation[];
  reminders: Reminder[];
  exams: Exam[];
  getPatientById: (id: string) => Patient | undefined;
  getConsultationsByPatientId: (patientId: string) => Consultation[];
  getConsultationByIds: (patientId: string, consultationId: string) => Consultation | undefined;
  getExamsByPatientId: (patientId: string) => Exam[];
  getReminders: () => Reminder[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updateUser: (userUpdates: Partial<Pick<User, 'name' | 'email' | 'photoURL'>>) => Promise<void>;
  uploadUserPhoto: (file: File) => Promise<string>;
  updatePatient: (patient: Patient) => void;
  addConsultation: (consultation: Omit<Consultation, 'id'>) => void;
  addExam: (exam: Omit<Exam, 'id'>) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (reminder: Reminder) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const fallbackUserId = import.meta.env.VITE_FIREBASE_USER_ID || MOCK_USER.id;

const sortDateAsc = <T extends { dateTime: string }>(items: T[]) =>
  [...items].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

const sortDateDesc = <T extends { dateTime: string }>(items: T[]) =>
  [...items].sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

const mapSnapshot = <T extends { id: string }>(snapshot: QuerySnapshot<DocumentData>): T[] =>
  snapshot.docs.map((entry) => ({ ...(entry.data() as Omit<T, 'id'>), id: entry.id }));

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'MN';

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { firebaseUser, firebaseUserId, isAuthLoading } = useAuth();
  const activeUserId = isFirebaseConfigured ? firebaseUserId : fallbackUserId;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [user, setUser] = useState<User>({ ...MOCK_USER, id: activeUserId || fallbackUserId });

  useEffect(() => {
    if (!db || !isFirebaseConfigured) {
      console.warn('Firestore nao configurado. Carregando dados mock em memoria.');
      setPatients(MOCK_PATIENTS);
      setConsultations(MOCK_CONSULTATIONS);
      setReminders(MOCK_REMINDERS);
      setExams(MOCK_EXAMS);
      setUser({ ...MOCK_USER, id: fallbackUserId });
      return;
    }

    if (isAuthLoading) {
      return;
    }

    if (!activeUserId) {
      setPatients([]);
      setConsultations([]);
      setReminders([]);
      setExams([]);
      setUser({ ...MOCK_USER, id: '' });
      return;
    }

    const userRef = doc(db, 'users', activeUserId);
    const fallbackName = firebaseUser?.displayName || MOCK_USER.name;
    const fallbackEmail = firebaseUser?.email || MOCK_USER.email;

    const unsubscribeUser = onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as User;
        const resolvedName = data.name || fallbackName;
        setUser({
          id: snapshot.id,
          name: resolvedName,
          email: data.email || fallbackEmail,
          initials: data.initials || getInitials(resolvedName),
          photoURL: data.photoURL,
        });
        return;
      }

      const initialUser: User = {
        id: activeUserId,
        name: fallbackName,
        email: fallbackEmail,
        initials: getInitials(fallbackName),
        photoURL: firebaseUser?.photoURL || undefined,
      };

      setUser(initialUser);
      void setDoc(userRef, initialUser, { merge: true }).catch((error) => {
        console.error('Erro ao criar documento do usuario no Firestore:', error);
      });
    });

    const unsubscribePatients = onSnapshot(collection(userRef, 'patients'), (snapshot) => {
      setPatients(mapSnapshot<Patient>(snapshot));
    });

    const unsubscribeConsultations = onSnapshot(collection(userRef, 'consultations'), (snapshot) => {
      setConsultations(mapSnapshot<Consultation>(snapshot));
    });

    const unsubscribeReminders = onSnapshot(collection(userRef, 'reminders'), (snapshot) => {
      setReminders(mapSnapshot<Reminder>(snapshot));
    });

    const unsubscribeExams = onSnapshot(collection(userRef, 'exams'), (snapshot) => {
      setExams(mapSnapshot<Exam>(snapshot));
    });

    return () => {
      unsubscribeUser();
      unsubscribePatients();
      unsubscribeConsultations();
      unsubscribeReminders();
      unsubscribeExams();
    };
  }, [activeUserId, firebaseUser?.displayName, firebaseUser?.email, isAuthLoading]);

  const writeDocument = async <T extends { id: string }>(collectionName: string, payload: T) => {
    if (!db || !isFirebaseConfigured || !activeUserId) {
      return;
    }

    const ref = doc(db, 'users', activeUserId, collectionName, payload.id);
    await setDoc(ref, payload, { merge: true });
  };

  const getPatientById = (id: string) => patients.find((patient) => patient.id === id);

  const getConsultationsByPatientId = (patientId: string) =>
    sortDateDesc(consultations.filter((consultation) => consultation.patientId === patientId));

  const getConsultationByIds = (patientId: string, consultationId: string) =>
    consultations.find(
      (consultation) => consultation.patientId === patientId && consultation.id === consultationId
    );

  const getExamsByPatientId = (patientId: string) =>
    sortDateDesc(exams.filter((exam) => exam.patientId === patientId));

  const getReminders = () => sortDateAsc(reminders);

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = { ...patientData, id: crypto.randomUUID() };
    setPatients((previous) => [...previous, newPatient]);
    void writeDocument('patients', newPatient).catch((error) => {
      console.error('Erro ao salvar paciente no Firestore:', error);
    });
  };

  const updateUser = async (userUpdates: Partial<Pick<User, 'name' | 'email' | 'photoURL'>>) => {
    const nextName = userUpdates.name?.trim() || user.name;
    const nextEmail = userUpdates.email?.trim() || user.email;
    const nextUser: User = {
      ...user,
      name: nextName,
      email: nextEmail,
      initials: getInitials(nextName),
      photoURL: userUpdates.photoURL ?? user.photoURL,
    };

    setUser(nextUser);

    if (!db || !isFirebaseConfigured || !activeUserId) {
      return;
    }

    const userRef = doc(db, 'users', activeUserId);
    await setDoc(userRef, nextUser, { merge: true });
  };

  const uploadUserPhoto = async (file: File): Promise<string> => {
    if (!storage || !isFirebaseConfigured || !activeUserId) {
      throw new Error('Firebase Storage nao esta configurado.');
    }

    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const avatarRef = ref(storage, `users/${activeUserId}/profile/avatar.${extension}`);
    await uploadBytes(avatarRef, file, {
      contentType: file.type || 'image/jpeg',
    });
    const photoURL = await getDownloadURL(avatarRef);
    await updateUser({ photoURL });
    return photoURL;
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((previous) =>
      previous.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient))
    );
    void writeDocument('patients', updatedPatient).catch((error) => {
      console.error('Erro ao atualizar paciente no Firestore:', error);
    });
  };

  const addConsultation = (consultationData: Omit<Consultation, 'id'>) => {
    const newConsultation: Consultation = { ...consultationData, id: crypto.randomUUID() };
    setConsultations((previous) => [...previous, newConsultation]);
    void writeDocument('consultations', newConsultation).catch((error) => {
      console.error('Erro ao salvar consulta no Firestore:', error);
    });
  };

  const addExam = (examData: Omit<Exam, 'id'>) => {
    const newExam: Exam = { ...examData, id: crypto.randomUUID() };
    setExams((previous) => [...previous, newExam]);
    void writeDocument('exams', newExam).catch((error) => {
      console.error('Erro ao salvar exame no Firestore:', error);
    });
  };

  const addReminder = (reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = { ...reminderData, id: crypto.randomUUID() };
    setReminders((previous) => [...previous, newReminder]);
    void writeDocument('reminders', newReminder).catch((error) => {
      console.error('Erro ao salvar lembrete no Firestore:', error);
    });
  };

  const updateReminder = (updatedReminder: Reminder) => {
    setReminders((previous) =>
      previous.map((reminder) => (reminder.id === updatedReminder.id ? updatedReminder : reminder))
    );
    void writeDocument('reminders', updatedReminder).catch((error) => {
      console.error('Erro ao atualizar lembrete no Firestore:', error);
    });
  };

  const value = useMemo(
    () => ({
      user,
      patients,
      consultations,
      reminders,
      exams,
      getPatientById,
      getConsultationsByPatientId,
      getConsultationByIds,
      getExamsByPatientId,
      getReminders,
      addPatient,
      updateUser,
      uploadUserPhoto,
      updatePatient,
      addConsultation,
      addExam,
      addReminder,
      updateReminder,
    }),
    [user, patients, consultations, reminders, exams]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

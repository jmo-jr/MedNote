
import type { Patient, Consultation, Reminder, User } from './types';
import type { Exam } from './types';

export const MOCK_USER: User = {
  id: 'user1',
  name: 'Alberto Cardozo',
  email: 'murilojava@gmail.com',
  initials: 'AC',
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Altair Marcos de Melo Neves da Fonseca',
    dob: '1980-12-08',
    phone: '(75) 99324-0948',
    email: 'altairmn@gmail.com',
    chronicDiseases: ['DM2', 'HAS', 'Hiperlipidemia Mista', 'Alzheimer', 'Câncer', 'Diabetes'],
    continuousMedication: ['Astorvastatina', 'Insulina', 'Losartana', 'Rosuvastatina Cálcica'],
  },
];

export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: 'c1',
    patientId: '1',
    location: 'Clínica',
    dateTime: '2026-10-15T15:05:00',
    subjective: 'Paciente reclamou que está sentindo dores no cotovelo da perna.',
    objective: 'Sinais vitais: ...\nResultado do exame anterior: ...\nExame físico: ....\nNão identifiquei onde fica o cotovelo da perna.',
    assessment: 'Paciente não possui cotovelo na perna. Encaminhar para psiquiatria.',
    plan: 'Diazepan 100mg uso contínuo + Invermectina 20mg 12/12 por 10 dias.',
    observations: '',
  },
];

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    patientId: '1',
    dateTime: '2025-10-25T12:30:00',
    note: 'Solicitar novamente tal e tal',
  },
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: 'e1',
    patientId: '1',
    dateTime: '2026-10-10T08:00:00',
    type: 'Hemograma',
    description: 'Exame de sangue completo',
    result: 'Hemoglobina: 13,5 g/dL\nLeucócitos: 7.000/mm³',
    observations: 'Paciente em jejum.',
  },
  {
    id: 'e2',
    patientId: '1',
    dateTime: '2026-09-15T10:30:00',
    type: 'Raio-X',
    description: 'Raio-X do tórax',
    result: 'Sem alterações pulmonares.',
    observations: '',
  },
];


import type { Patient, Consultation, Reminder, User } from './types';

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
  {
    id: '2',
    name: 'Demósthenes Cunha Ferreira dos Santos',
    dob: '1975-05-20',
    phone: '(11) 98765-4321',
    email: 'demosthenes@email.com',
    chronicDiseases: ['HAS'],
    continuousMedication: ['Losartana'],
  },
  {
    id: '3',
    name: 'Maria José Borges do Nascimento',
    dob: '1960-02-15',
    phone: '(21) 99999-8888',
    email: 'maria.jose@email.com',
    chronicDiseases: ['Diabetes'],
    continuousMedication: ['Metformina'],
  },
  {
    id: '4',
    name: 'Zoreide Zoraia Zaruia',
    dob: '1992-11-30',
    phone: '(31) 91234-5678',
    email: 'zoreide.z@email.com',
    chronicDiseases: [],
    continuousMedication: [],
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
  {
    id: 'c2',
    patientId: '1',
    location: 'PSF',
    dateTime: '2025-10-15T15:30:00',
    subjective: 'Check-up de rotina.',
    objective: 'Pressão arterial 130/80 mmHg. Glicemia de jejum 98 mg/dL.',
    assessment: 'Controle adequado de HAS e DM2.',
    plan: 'Manter medicação atual e retornar em 6 meses.',
    observations: 'Paciente relata boa adesão ao tratamento.',
  },
  {
    id: 'c3',
    patientId: '1',
    location: 'Clínica',
    dateTime: '2025-05-01T12:22:00',
    subjective: 'Queixa de tosse seca há 2 semanas.',
    objective: 'Ausculta pulmonar limpa. Sem febre.',
    assessment: 'Provável tosse alérgica.',
    plan: 'Prescrito anti-histamínico.',
    observations: '',
  },
   {
    id: 'c4',
    patientId: '1',
    location: 'PSF',
    dateTime: '2024-12-12T11:31:00',
    subjective: 'Renovação de receita.',
    objective: 'Paciente estável.',
    assessment: 'Paciente estável.',
    plan: 'Receitas renovadas.',
    observations: '',
  }
];

export const MOCK_REMINDERS: Reminder[] = [
  {
    id: 'r1',
    patientId: '1',
    dateTime: '2025-10-25T12:30:00',
    note: 'Solicitar novamente tal e tal',
  },
  {
    id: 'r2',
    patientId: '2',
    dateTime: '2025-10-29T15:00:00',
    note: 'Verificar resultados de exames de sangue.',
  },
  {
    id: 'r3',
    patientId: '3',
    dateTime: '2025-10-31T08:00:00',
    note: 'Ligar para agendar retorno com cardiologista.',
  },
  {
    id: 'r4',
    patientId: '4',
    dateTime: '2025-11-05T10:30:00',
    note: 'Discutir opções de check-up anual.',
  },
];

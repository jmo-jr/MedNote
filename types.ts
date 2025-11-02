
export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
}

export interface Patient {
  id: string;
  name: string;
  dob: string;
  phone: string;
  email: string;
  chronicDiseases: string[];
  continuousMedication: string[];
}

export interface Consultation {
  id: string;
  patientId: string;
  location: string;
  dateTime: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  observations?: string;
}

export interface Reminder {
  id: string;
  patientId: string;
  dateTime: string;
  note: string;
}

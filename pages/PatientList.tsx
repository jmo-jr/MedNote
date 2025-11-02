
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import type { Patient } from '../types';
import NewPatientModal from '../components/modals/NewPatientModal';

const PatientListItem: React.FC<{ patient: Patient }> = ({ patient }) => {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0].substring(0, 2);
  };
  
  const initial = patient.name.charAt(0);

  return (
    <Link to={`/patient/${patient.id}`} className="block">
      <div className="flex items-center p-2 hover:bg-med-gray-100 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-med-purple bg-opacity-20 flex items-center justify-center mr-4">
          <span className="font-bold text-med-purple">{initial}</span>
        </div>
        <span className="text-med-gray-700 truncate">
          {patient.name}
        </span>
      </div>
    </Link>
  );
};

const PatientList: React.FC = () => {
  const { patients } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative h-full">
      <div className="space-y-2">
        {patients.map(patient => (
          <PatientListItem key={patient.id} patient={patient} />
        ))}
      </div>

      <button
        onClick={openModal}
        className="fixed bottom-6 right-1/2 translate-x-[11rem] md:translate-x-[12rem] h-14 w-14 bg-med-purple rounded-full text-white flex items-center justify-center shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-purple"
        aria-label="Adicionar Novo Paciente"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <NewPatientModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default PatientList;

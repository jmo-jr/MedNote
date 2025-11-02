import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import NewConsultationModal from '../components/modals/NewConsultationModal';

const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const Accordion: React.FC<{ title: string; children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-med-gray-100 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-medium text-med-gray-700"
      >
        <span>{title}</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 pt-0 text-med-gray-600">{children}</div>}
    </div>
  );
};

const PatientDetail: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { getPatientById, getConsultationsByPatientId, user } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const patient = getPatientById(patientId!);
  const consultations = getConsultationsByPatientId(patientId!);

  if (!patient) {
    return <div>Paciente não encontrado.</div>;
  }
  
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  return (
    <div className="flex flex-col h-screen">
      <header className="sticky top-0 bg-white shadow-sm z-10 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="text-med-gray-600">
                <BackArrowIcon className="h-6 w-6"/>
            </button>
            <h1 className="text-lg font-semibold text-med-gray-800 truncate">{patient.name}</h1>
        </div>
        <Link to="/profile">
          <div className="h-10 w-10 bg-med-gray-300 rounded-full flex items-center justify-center font-bold text-med-gray-600">
            {user.initials}
          </div>
        </Link>
      </header>
      
      <main className="flex-grow overflow-y-auto p-4 space-y-4">
        <Accordion title="Dados do paciente">
          <ul className="space-y-1 text-sm">
            <li><strong>Nome:</strong> {patient.name}</li>
            <li><strong>Data de Nasc.:</strong> {formatDate(patient.dob)}</li>
            <li><strong>Telefone:</strong> {patient.phone}</li>
            <li><strong>E-mail:</strong> {patient.email}</li>
          </ul>
        </Accordion>

        <Accordion title="Doenças crônicas">
          <ul className="list-disc list-inside text-sm space-y-1">
            {patient.chronicDiseases.map(d => <li key={d}>{d}</li>)}
          </ul>
        </Accordion>
        
        <Accordion title="Remédios de uso controlado">
          <ul className="list-disc list-inside text-sm space-y-1">
            {patient.continuousMedication.map(m => <li key={m}>{m}</li>)}
          </ul>
        </Accordion>

        <div className="bg-white border border-med-gray-200 rounded-lg p-4">
            <h2 className="font-medium text-med-gray-700 mb-2 flex justify-between items-center">
                Histórico de consultas
                <ChevronDownIcon className="w-5 h-5 rotate-180" />
            </h2>
            <div className="space-y-2">
                {consultations.map((consultation, index) => (
                    <Link 
                        key={consultation.id} 
                        to={`/patient/${patientId}/consultation/${consultation.id}`}
                        className={`block p-3 rounded-lg ${index === 1 ? 'bg-med-gray-100' : 'hover:bg-med-gray-50'}`}
                    >
                        <p className="text-sm text-med-gray-700">
                            {consultation.location}, {new Date(consultation.dateTime).toLocaleDateString('pt-BR')}, {new Date(consultation.dateTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
        
      </main>
      
      <button
        onClick={openModal}
        className="fixed bottom-6 right-1/2 translate-x-[11rem] md:translate-x-[12rem] h-14 w-14 bg-med-purple rounded-full text-white flex items-center justify-center shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-purple"
        aria-label="Adicionar Nova Consulta"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <NewConsultationModal isOpen={isModalOpen} onClose={closeModal} patient={patient} />
    </div>
  );
};

export default PatientDetail;
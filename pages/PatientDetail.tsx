import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import AppHeader from '../components/AppHeader.tsx';
import NewConsultationModal from '../components/modals/NewConsultationModal';
import EditPatientModal from '../components/modals/EditPatientModal';
import NewReminderModal from '../components/modals/NewReminderModal';
import NewExamModal from '../components/modals/NewExamModal';

const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
  const { getPatientById, getConsultationsByPatientId, getExamsByPatientId } = useData();

  const [isNewConsultationModalOpen, setIsNewConsultationModalOpen] = useState(false);
  const openNewConsultationModal = () => setIsNewConsultationModalOpen(true);
  const closeNewConsultationModal = () => setIsNewConsultationModalOpen(false);
  const [isNewReminderModalOpen, setIsNewReminderModalOpen] = useState(false);
  const openNewReminderModal = () => setIsNewReminderModalOpen(true);
  const closeNewReminderModal = () => setIsNewReminderModalOpen(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  // Novo estado para modal de exame
  const [isNewExamModalOpen, setIsNewExamModalOpen] = useState(false);
  const openNewExamModal = () => setIsNewExamModalOpen(true);
  const closeNewExamModal = () => setIsNewExamModalOpen(false);

  const patient = getPatientById(patientId!);
  const consultations = getConsultationsByPatientId(patientId!);
  const exams = getExamsByPatientId(patientId!);

  if (!patient) {
    return <div>Paciente não encontrado.</div>;
  }

  const formatDate = (dateString: string) => {
    // Input dates for patients are YYYY-MM-DD. We force local interpretation.
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR');
  };

  return (
    <div className="flex flex-col h-screen">
      <AppHeader />
      <header className="sticky top-0 bg-white shadow-sm z-10 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="text-med-gray-600">
                <BackArrowIcon className="h-6 w-6"/>
            </button>
            <h1 className="text-lg font-semibold text-med-gray-800 truncate" style={{maxWidth: 73 + 'vw'}}>{patient.name}</h1>
        </div>
        <button onClick={openEditModal} className="text-med-gray-600 hover:text-med-purple">
            <PencilIcon className="h-5 w-5"/>
        </button>
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

        <Accordion title="Histórico de exames" defaultOpen={false}>
          <div className="space-y-2">
            {exams.length === 0 && <div className="text-sm text-med-gray-500">Nenhum exame cadastrado.</div>}
            {exams.map((exam, index) => (
              <div key={exam.id} className={`block p-3 rounded-lg ${index === 1 ? 'bg-med-gray-100' : 'hover:bg-med-gray-50'}`}>
                <div className="text-sm text-med-gray-700 font-semibold">
									{new Date(exam.dateTime).toLocaleDateString('pt-BR')} - {exam.type}
								</div>
                <div className="text-xs text-med-gray-600">{exam.description}</div>
              </div>
            ))}
          </div>
          <div className="p-4 shrink-0 space-y-3">
            <button
              onClick={openNewExamModal}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
              aria-label="Adicionar Novo Exame"
            >
              Cadastrar novo exame
            </button>
          </div>
        </Accordion>
				
        <Accordion title="Histórico de consultas" defaultOpen={true}>
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
          <div className="p-4 shrink-0 space-y-3">
            <button
              onClick={openNewConsultationModal}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
              aria-label="Adicionar Nova Consulta"
            >
              Cadastrar nova consulta
            </button>
            <button
              onClick={openNewReminderModal}
              className="w-full flex justify-center py-3 px-4 border border-med-teal rounded-md shadow-sm text-sm font-medium text-med-teal bg-white hover:bg-med-teal-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
              aria-label="Criar novo lembrete"
            >
              Criar lembrete
            </button>
          </div>
        </Accordion>
        
      </main>

      <NewConsultationModal isOpen={isNewConsultationModalOpen} onClose={closeNewConsultationModal} patient={patient} />
      <NewReminderModal isOpen={isNewReminderModalOpen} onClose={closeNewReminderModal} patient={patient} />
      <EditPatientModal isOpen={isEditModalOpen} onClose={closeEditModal} patient={patient} />
      <NewExamModal isOpen={isNewExamModalOpen} onClose={closeNewExamModal} patient={patient} />
    </div>
  );
};

export default PatientDetail;

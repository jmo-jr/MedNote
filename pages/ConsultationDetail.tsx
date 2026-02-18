
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';

const BackArrowIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
);

const DetailSection: React.FC<{ label: string; content?: string }> = ({ label, content }) => (
  <div>
    <h3 className="font-bold text-med-gray-800">{label}:</h3>
    <p className="text-med-gray-600 whitespace-pre-wrap">{content || '...'}</p>
  </div>
);

const ConsultationDetail: React.FC = () => {
  const { patientId, consultationId } = useParams<{ patientId: string; consultationId: string }>();
  const navigate = useNavigate();
  const { getPatientById, getConsultationByIds } = useData();

  const patient = getPatientById(patientId!);
  const consultation = getConsultationByIds(patientId!, consultationId!);

  if (!patient || !consultation) {
    return <div>Consulta não encontrada.</div>;
  }

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white p-4 flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="text-med-gray-600">
          <BackArrowIcon className="h-6 w-6"/>
        </button>
        <h1 className="text-xl font-bold text-med-gray-800">Notas de Consulta</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-6 space-y-4">
        <p><span className="font-bold">Paciente:</span> {patient.name}</p>
        <p><span className="font-bold">Local:</span> {consultation.location}</p>
        <p><span className="font-bold">Data e Hora:</span> {formatDateTime(consultation.dateTime)}</p>
        
        <div className="space-y-6 mt-4">
            <DetailSection label="Subjetivo" content={consultation.subjective} />
            <DetailSection label="Objetiva" content={consultation.objective} />
            <DetailSection label="Avaliação" content={consultation.assessment} />
            <DetailSection label="Plano" content={consultation.plan} />
            <DetailSection label="Solicitação de Exames" content={consultation.examRequests} />
            <DetailSection label="Resultados de Exames" content={consultation.examResults} />
            <DetailSection label="Observações" content={consultation.observations} />
        </div>
      </main>

      <footer className="p-4 bg-white sticky bottom-0">
        <button
          className="w-full flex justify-center py-3 px-4 border border-med-teal-light rounded-md shadow-sm text-sm font-medium text-med-teal bg-med-teal-light bg-opacity-40 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
        >
          Editar
        </button>
      </footer>
    </div>
  );
};

export default ConsultationDetail;
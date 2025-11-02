import React, { useState } from 'react';
import type { Patient } from '../../types';
import { useData } from '../../context/DataContext';
import NewReminderModal from './NewReminderModal';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const FormTextarea: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number }> = ({ label, id, value, onChange, rows = 3 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-med-gray-700">
            {label}
        </label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            rows={rows}
            className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal"
        />
    </div>
);


interface NewConsultationModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient | undefined;
}

const NewConsultationModal: React.FC<NewConsultationModalProps> = ({ isOpen, onClose, patient }) => {
    const { addConsultation } = useData();

    const [location, setLocation] = useState('PSF');
    const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));
    const [subjective, setSubjective] = useState('');
    const [objective, setObjective] = useState('');
    const [assessment, setAssessment] = useState('');
    const [plan, setPlan] = useState('');
    const [observations, setObservations] = useState('');
    const [isNewReminderModalOpen, setIsNewReminderModalOpen] = useState(false);


    if (!isOpen || !patient) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const consultationData = {
            patientId: patient.id,
            location,
            dateTime,
            subjective,
            objective,
            assessment,
            plan,
            observations
        };
        addConsultation(consultationData);
        onClose();
    };
    
    return (
        <>
            <div 
                className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
                onClick={onClose}
                aria-modal="true"
                role="dialog"
            >
                <div 
                    className="bg-white rounded-xl shadow-xl w-full max-w-md relative max-h-[95vh] flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="p-6 flex justify-between items-start border-b border-med-gray-200 shrink-0">
                        <div>
                            <h2 className="text-xl font-bold text-med-gray-800">Cadastro de Nova Consulta</h2>
                            <p className="text-sm text-med-gray-600 mt-1">{patient.name}</p>
                        </div>
                        <button onClick={onClose} className="text-med-gray-400 hover:text-med-gray-600">
                            <CloseIcon className="h-6 w-6"/>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-med-gray-700">Local</label>
                            <select id="location" value={location} onChange={e => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-med-teal focus:border-med-teal">
                                <option>PSF</option>
                                <option>Clínica</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="datetime" className="block text-sm font-medium text-med-gray-700">Data e Hora</label>
                            <input type="datetime-local" id="datetime" value={dateTime} onChange={e => setDateTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm"/>
                        </div>

                        <FormTextarea label="Subjetivo" id="subjective" value={subjective} onChange={e => setSubjective(e.target.value)} rows={2} />
                        <FormTextarea label="Objetiva" id="objective" value={objective} onChange={e => setObjective(e.target.value)} rows={4} />
                        <FormTextarea label="Avaliação" id="assessment" value={assessment} onChange={e => setAssessment(e.target.value)} rows={2} />
                        <FormTextarea label="Plano" id="plan" value={plan} onChange={e => setPlan(e.target.value)} rows={2} />
                        <FormTextarea label="Observações" id="observations" value={observations} onChange={e => setObservations(e.target.value)} rows={2} />
                    </form>

                    <div className="p-6 border-t border-med-gray-200 shrink-0 space-y-3">
                        <button
                            type="button"
                            onClick={() => setIsNewReminderModalOpen(true)}
                            className="w-full flex justify-center py-3 px-4 border border-med-teal-light rounded-md shadow-sm text-sm font-medium text-med-teal bg-med-teal-light bg-opacity-40 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
                        >
                            Criar Lembrete
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
            <NewReminderModal 
                isOpen={isNewReminderModalOpen}
                onClose={() => setIsNewReminderModalOpen(false)}
                patient={patient}
            />
        </>
    );
};

export default NewConsultationModal;

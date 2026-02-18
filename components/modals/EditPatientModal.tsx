
import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import type { Patient } from '../../types';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const FormInput: React.FC<{ label: string; id: string; type: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, id, type, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-med-gray-700">
            {label}
        </label>
        <input
            type={type}
            id={id}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal text-med-gray-900"
            required
        />
    </div>
);

const FormTextarea: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; rows?: number; placeholder?: string }> = ({ label, id, value, onChange, rows = 4, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-med-gray-700">
            {label}
        </label>
        <textarea
            id={id}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal text-med-gray-900"
        />
    </div>
);

interface EditPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({ isOpen, onClose, patient }) => {
    const { updatePatient } = useData();
    
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [chronicDiseasesInput, setChronicDiseasesInput] = useState('');
    const [continuousMedicationInput, setContinuousMedicationInput] = useState('');

    useEffect(() => {
        if (patient) {
            setName(patient.name);
            setDob(patient.dob);
            setPhone(patient.phone);
            setEmail(patient.email);
            setChronicDiseasesInput(patient.chronicDiseases.join('\n'));
            setContinuousMedicationInput(patient.continuousMedication.join('\n'));
        }
    }, [patient, isOpen]);


    if (!isOpen) {
        return null;
    }

    const processInputToArray = (text: string) => {
        return text
            .split(/[\n,]+/)
            .map(item => item.trim())
            .filter(item => item !== '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const patientData: Patient = {
            id: patient.id,
            name,
            dob,
            phone,
            email,
            chronicDiseases: processInputToArray(chronicDiseasesInput),
            continuousMedication: processInputToArray(continuousMedicationInput),
        };
        updatePatient(patientData);
        onClose();
    };

    return (
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
                <div className="p-6 flex justify-between items-center border-b border-med-gray-200 shrink-0">
                    <h2 className="text-xl font-bold text-med-gray-800">Editar Dados do Paciente</h2>
                    <button onClick={onClose} className="text-med-gray-400 hover:text-med-gray-600">
                        <CloseIcon className="h-6 w-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    <FormInput label="Nome completo" id="fullName" type="text" value={name} onChange={e => setName(e.target.value)} />
                    <FormInput label="Data de Nascimento" id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                    <FormInput label="Telefone" id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                    <FormInput label="E-mail" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

                    <FormTextarea 
                        label="Doenças Crônicas" 
                        id="chronicDiseases" 
                        value={chronicDiseasesInput} 
                        onChange={e => setChronicDiseasesInput(e.target.value)}
                        placeholder="Uma por linha ou separadas por vírgula"
                    />

                    <FormTextarea 
                        label="Remédios de uso contínuo" 
                        id="continuousMedication" 
                        value={continuousMedicationInput} 
                        onChange={e => setContinuousMedicationInput(e.target.value)}
                        placeholder="Uma por linha ou separadas por vírgula"
                    />
                </form>

                <div className="p-6 border-t border-med-gray-200 shrink-0">
                     <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditPatientModal;

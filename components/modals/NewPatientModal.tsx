import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

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
            className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal"
            required
        />
    </div>
);

const Checkbox: React.FC<{ label: string; id: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, id, checked, onChange }) => (
    <div className="flex items-center">
        <input
            id={id}
            name={id}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className="h-4 w-4 text-med-purple border-med-gray-300 rounded focus:ring-med-purple"
        />
        <label htmlFor={id} className="ml-3 block text-sm font-medium text-med-gray-700">
            {label}
        </label>
    </div>
);


interface NewPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewPatientModal: React.FC<NewPatientModalProps> = ({ isOpen, onClose }) => {
    const { addPatient } = useData();
    
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [diseases, setDiseases] = useState<Record<string, boolean>>({});
    const [meds, setMeds] = useState<Record<string, boolean>>({});
    
    const chronicDiseaseOptions = ['DM2', 'HAS', 'Hiperlipidemia Mista', 'Alzheimer', 'Câncer', 'Diabetes'];
    const continuousMedicationOptions = ['Astorvastatina', 'Insulina', 'Losartana', 'Rosuvastatina Cálcica'];

    if (!isOpen) {
        return null;
    }
    
    const handleDiseaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDiseases({ ...diseases, [e.target.name]: e.target.checked });
    };

    const handleMedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMeds({ ...meds, [e.target.name]: e.target.checked });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const patientData = {
            name,
            dob,
            phone,
            email,
            chronicDiseases: Object.keys(diseases).filter(k => diseases[k]),
            continuousMedication: Object.keys(meds).filter(k => meds[k]),
        };
        addPatient(patientData);
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
                    <h2 className="text-xl font-bold text-med-gray-800">Cadastro de Novo Paciente</h2>
                    <button onClick={onClose} className="text-med-gray-400 hover:text-med-gray-600">
                        <CloseIcon className="h-6 w-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                    <FormInput label="Nome completo" id="fullName" type="text" value={name} onChange={e => setName(e.target.value)} />
                    <FormInput label="Data de Nascimento" id="dob" type="date" value={dob} onChange={e => setDob(e.target.value)} />
                    <FormInput label="Telefone" id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                    <FormInput label="E-mail" id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

                    <div>
                        <p className="block text-sm font-medium text-med-gray-700 mb-2">Doenças Crônicas?</p>
                        <div className="space-y-3">
                            {chronicDiseaseOptions.map((disease) => (
                                <Checkbox key={disease} id={disease} label={disease} checked={!!diseases[disease]} onChange={handleDiseaseChange} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="block text-sm font-medium text-med-gray-700 mb-2">Remédios de uso contínuo?</p>
                        <div className="space-y-3">
                            {continuousMedicationOptions.map((med) => (
                                <Checkbox key={med} id={med} label={med} checked={!!meds[med]} onChange={handleMedChange} />
                            ))}
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-med-gray-200 shrink-0">
                     <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
                    >
                        Cadastrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NewPatientModal;

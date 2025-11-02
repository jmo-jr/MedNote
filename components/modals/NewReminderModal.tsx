import React, { useState } from 'react';
import type { Patient } from '../../types';
import { useData } from '../../context/DataContext';

const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const CalendarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

interface NewReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    patient: Patient;
}

const NewReminderModal: React.FC<NewReminderModalProps> = ({ isOpen, onClose, patient }) => {
    const { addReminder } = useData();

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const [dateValue, setDateValue] = useState(tomorrow.toISOString().split('T')[0]);
    const [timeValue, setTimeValue] = useState('09:00');
    const [note, setNote] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const [hour, minute] = timeValue.split(':');
        const newDateTime = new Date(dateValue);
        newDateTime.setHours(parseInt(hour, 10));
        newDateTime.setMinutes(parseInt(minute, 10));

        const reminderData = {
            patientId: patient.id,
            dateTime: newDateTime.toISOString(),
            note,
        };
        addReminder(reminderData);
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
                className="bg-white rounded-xl shadow-xl w-full max-w-sm relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 flex justify-between items-start border-b border-med-gray-200">
                    <div>
                        <h2 className="text-xl font-bold text-med-gray-800">Criar Novo Lembrete</h2>
                    </div>
                    <button onClick={onClose} className="text-med-gray-400 hover:text-med-gray-600">
                        <CloseIcon className="h-6 w-6"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <p className="text-sm font-medium text-med-gray-700">Paciente:</p>
                            <p className="text-med-gray-800">{patient?.name}</p>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-med-gray-700">Data:</label>
                            <div className="relative mt-1">
                                <input type="date" id="date" value={dateValue} onChange={e => setDateValue(e.target.value)} className="block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm"/>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-med-gray-400"/>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-med-gray-700">Horário:</label>
                            <div className="relative mt-1">
                                <input type="time" id="time" value={timeValue} onChange={e => setTimeValue(e.target.value)} className="block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm"/>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-med-gray-400"/>
                                </span>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="reminder-note" className="block text-sm font-medium text-med-gray-700">Lembrete:</label>
                            <textarea id="reminder-note" rows={3} value={note} onChange={e => setNote(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm" required></textarea>
                        </div>
                    </div>

                    <div className="p-6 border-t border-med-gray-200 flex space-x-3">
                         <button
                            type="button"
                            onClick={onClose}
                            className="w-full flex justify-center py-3 px-4 border border-med-gray-300 rounded-md shadow-sm text-sm font-medium text-med-gray-700 bg-white hover:bg-med-gray-50"
                        >
                            Cancelar
                        </button>
                         <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewReminderModal;

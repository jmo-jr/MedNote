import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Reminder } from '../types';
import ReminderDetailModal from '../components/modals/ReminderDetailModal';
import NewReminderModal from '../components/modals/NewReminderModal';

const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ReminderListItem: React.FC<{ reminder: Reminder; onClick: () => void }> = ({ reminder, onClick }) => {
  const { getPatientById } = useData();
  const patient = getPatientById(reminder.patientId);
  const reminderDate = new Date(reminder.dateTime);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <button onClick={onClick} className="w-full text-left p-2 hover:bg-med-gray-100 rounded-lg">
      <div className="text-sm text-med-gray-600">
        {formatDate(reminderDate)} {formatTime(reminderDate)}
      </div>
      <div className="font-medium text-med-gray-800 truncate">
        {patient?.name || 'Paciente não encontrado'}
      </div>
      <div className="text-sm text-med-gray-500 mt-1">
        {reminder.note}
      </div>
    </button>
  );
};

const Reminders: React.FC = () => {
  const { getReminders } = useData();
  const reminders = getReminders();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [isNewReminderModalOpen, setIsNewReminderModalOpen] = useState(false);

  const handleOpenModal = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReminder(null);
  };

  const openNewReminderModal = () => setIsNewReminderModalOpen(true);
  const closeNewReminderModal = () => setIsNewReminderModalOpen(false);

  return (
    <>
      <div className="divide-y divide-med-gray-200">
        {reminders.map(reminder => (
          <ReminderListItem key={reminder.id} reminder={reminder} onClick={() => handleOpenModal(reminder)} />
        ))}
      </div>
      <button
        type="button"
        onClick={openNewReminderModal}
        className="fixed bottom-6 right-6 bg-med-teal text-white rounded-full shadow-lg flex items-center justify-center w-14 h-14 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
        aria-label="Adicionar lembrete"
      >
        <PlusIcon className="h-6 w-6" />
      </button>
      <ReminderDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        reminder={selectedReminder}
      />
      <NewReminderModal 
        isOpen={isNewReminderModalOpen}
        onClose={closeNewReminderModal}
      />
    </>
  );
};

export default Reminders;

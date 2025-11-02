import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import type { Reminder } from '../types';
import ReminderDetailModal from '../components/modals/ReminderDetailModal';

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

  const handleOpenModal = (reminder: Reminder) => {
    setSelectedReminder(reminder);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReminder(null);
  };

  return (
    <>
      <div className="divide-y divide-med-gray-200">
        {reminders.map(reminder => (
          <ReminderListItem key={reminder.id} reminder={reminder} onClick={() => handleOpenModal(reminder)} />
        ))}
      </div>
      <ReminderDetailModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        reminder={selectedReminder}
      />
    </>
  );
};

export default Reminders;
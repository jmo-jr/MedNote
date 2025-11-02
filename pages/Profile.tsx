
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import AppHeader from '../components/AppHeader';

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const Profile: React.FC = () => {
    const { user } = useData();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('edit');

    const handleSave = () => {
        // Save logic here
        navigate(-1);
    };

    return (
        <div className="flex flex-col h-screen">
            <AppHeader />
            <main className="flex-grow p-6">
                <h2 className="text-2xl font-bold mb-6">Perfil</h2>

                <div className="relative mb-6">
                    <div className="w-32 h-32 bg-med-gray-300 rounded-full flex items-center justify-center font-bold text-4xl text-med-gray-600 mx-auto">
                        {user.initials}
                    </div>
                    <button className="absolute bottom-0 right-1/2 translate-x-12 h-8 w-8 bg-med-purple rounded-full text-white flex items-center justify-center shadow-md">
                        <PencilIcon className="w-5 h-5"/>
                    </button>
                </div>
                
                <div className="border-b border-med-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('edit')}
                            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'edit'
                                ? 'border-med-purple text-med-purple'
                                : 'border-transparent text-med-gray-500 hover:text-med-gray-700'
                            }`}
                        >
                            Editar
                        </button>
                        <button
                           onClick={() => setActiveTab('signature')}
                           className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'signature'
                                ? 'border-med-purple text-med-purple'
                                : 'border-transparent text-med-gray-500 hover:text-med-gray-700'
                            }`}
                        >
                            Assinatura
                        </button>
                    </nav>
                </div>

                {activeTab === 'edit' ? (
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-med-gray-700">
                                Nome e Sobrenome
                            </label>
                            <input
                                type="text"
                                id="name"
                                defaultValue={user.name}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-med-teal focus:border-med-teal"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-med-gray-700">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                defaultValue={user.email}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-med-teal focus:border-med-teal"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-med-gray-700">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                defaultValue="************"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-med-teal focus:border-med-teal"
                            />
                        </div>
                    </form>
                ) : (
                    <div className="text-center text-med-gray-500 py-10">
                        Área de Assinatura em breve.
                    </div>
                )}
            </main>
            <footer className="p-4 bg-white sticky bottom-0">
                <button
                    onClick={handleSave}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
                >
                    Salvar Alterações
                </button>
            </footer>
        </div>
    );
};

export default Profile;

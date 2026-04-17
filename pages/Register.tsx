
import React from 'react';
import { FirebaseError } from 'firebase/app';
import { Link, useNavigate } from 'react-router-dom';
import LogoIcon from '../components/icons/LogoIcon';
import { useAuth } from '../context/AuthContext';

const getFirebaseAuthErrorMessage = (error: unknown) => {
  if (!(error instanceof FirebaseError)) {
    return 'Nao foi possivel criar a conta. Tente novamente.';
  }

  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Ja existe uma conta com este e-mail.';
    case 'auth/invalid-email':
      return 'O e-mail informado e invalido.';
    case 'auth/weak-password':
      return 'A senha precisa ter pelo menos 6 caracteres.';
    default:
      return 'Falha ao criar conta. Verifique os dados e tente novamente.';
  }
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/patients', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await register(name, email, password);
    } catch (error) {
      setErrorMessage(getFirebaseAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm text-center">
        <div className="flex flex-col items-center mb-10">
          <LogoIcon className="h-16 w-16 text-med-gray-800" />
          <h1 className="text-4xl font-bold text-med-gray-800 mt-2">
            Med<span className="text-med-teal">Note</span>
          </h1>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-6 text-left">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-med-gray-700">
              Nome e Sobrenome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={event => setName(event.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal text-med-gray-900"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-med-gray-700">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal text-med-gray-900"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-med-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal text-med-gray-900"
              required
              minLength={6}
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-med-teal hover:text-teal-700">
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

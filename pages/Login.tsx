
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoIcon from '../components/icons/LogoIcon';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/patients', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
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
        
        <form onSubmit={handleLogin} className="space-y-6 text-left">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-med-gray-700">
              E-mail cadastrado
            </label>
            <input
              type="email"
              id="email"
              defaultValue="murilojava@gmail.com"
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
              defaultValue="************"
              className="mt-1 block w-full px-3 py-2 bg-white border border-med-gray-300 rounded-md shadow-sm placeholder-med-gray-400 focus:outline-none focus:ring-med-teal focus:border-med-teal text-med-gray-900"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-med-teal hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-med-teal hover:text-teal-700">
            Esqueci a senha
          </a>
        </div>
        
        <div className="mt-8">
           <Link
            to="/register"
            className="w-full flex justify-center py-3 px-4 border border-med-teal-light rounded-md shadow-sm text-sm font-medium text-med-teal bg-med-teal-light bg-opacity-40 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-med-teal"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

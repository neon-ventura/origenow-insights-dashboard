
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente SVG para o logo da Anye
const AnyeLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="80" 
    height="50" 
    viewBox="0 0 60 37.5" 
    preserveAspectRatio="xMidYMid meet"
    className="h-8 w-auto"
  >
    <defs>
      <clipPath id="48d9acdb08">
        <path d="M 46.964844 28.34375 L 53.949219 28.34375 L 53.949219 30.824219 L 46.964844 30.824219 Z M 46.964844 28.34375 "/>
      </clipPath>
    </defs>
    <g>
      <g style={{fill: '#006cea', fillOpacity: 1}}>
        <g transform="translate(0.394737, 25.909254)">
          <path style={{stroke: 'none'}} d="M 13.59375 -4.5625 C 13.59375 -4 13.726562 -3.53125 14 -3.15625 C 14.269531 -2.789062 14.597656 -2.503906 14.984375 -2.296875 L 13.40625 0.21875 C 12.925781 0.175781 12.457031 0.0664062 12 -0.109375 C 11.539062 -0.296875 11.125 -0.613281 10.75 -1.0625 C 10.320312 -0.738281 9.789062 -0.4375 9.15625 -0.15625 C 8.519531 0.125 7.757812 0.265625 6.875 0.265625 C 5.800781 0.265625 4.796875 0.03125 3.859375 -0.4375 C 2.921875 -0.914062 2.164062 -1.625 1.59375 -2.5625 C 1.03125 -3.5 0.75 -4.644531 0.75 -6 C 0.75 -7.300781 1.035156 -8.414062 1.609375 -9.34375 C 2.191406 -10.28125 2.945312 -10.992188 3.875 -11.484375 C 4.800781 -11.984375 5.800781 -12.234375 6.875 -12.234375 C 7.695312 -12.234375 8.445312 -12.101562 9.125 -11.84375 C 9.800781 -11.59375 10.363281 -11.273438 10.8125 -10.890625 L 11.46875 -11.828125 L 13.59375 -11.828125 Z M 7.5 -2.6875 C 8.050781 -2.6875 8.5 -2.773438 8.84375 -2.953125 C 9.195312 -3.140625 9.566406 -3.375 9.953125 -3.65625 L 9.953125 -8.5 C 9.628906 -8.726562 9.265625 -8.914062 8.859375 -9.0625 C 8.460938 -9.21875 8.007812 -9.296875 7.5 -9.296875 C 6.550781 -9.296875 5.804688 -8.972656 5.265625 -8.328125 C 4.722656 -7.679688 4.453125 -6.882812 4.453125 -5.9375 C 4.453125 -5.039062 4.722656 -4.273438 5.265625 -3.640625 C 5.804688 -3.003906 6.550781 -2.6875 7.5 -2.6875 Z M 7.5 -2.6875 "/>
        </g>
      </g>
      <g style={{fill: '#006cea', fillOpacity: 1}}>
        <g transform="translate(15.074776, 25.909254)">
          <path style={{stroke: 'none'}} d="M 7.921875 -12.234375 C 9.597656 -12.234375 10.976562 -11.703125 12.0625 -10.640625 C 13.15625 -9.578125 13.703125 -8.03125 13.703125 -6 L 13.703125 0 L 10.078125 0 L 10.078125 -5.9375 C 10.078125 -6.863281 9.851562 -7.65625 9.40625 -8.3125 C 8.96875 -8.96875 8.273438 -9.296875 7.328125 -9.296875 C 6.921875 -9.296875 6.488281 -9.210938 6.03125 -9.046875 C 5.582031 -8.890625 5.1875 -8.6875 4.84375 -8.4375 L 4.84375 0 L 1.203125 0 L 1.203125 -11.828125 L 3.265625 -11.828125 L 4 -10.6875 C 4.582031 -11.269531 5.222656 -11.671875 5.921875 -11.890625 C 6.628906 -12.117188 7.296875 -12.234375 7.921875 -12.234375 Z M 7.921875 -12.234375 "/>
        </g>
      </g>
      <g style={{fill: '#006cea', fillOpacity: 1}}>
        <g transform="translate(29.240255, 25.909254)">
          <path style={{stroke: 'none'}} d="M 10.625 -11.828125 L 14.796875 -11.828125 L 10.015625 0 C 9.671875 0.84375 9.226562 1.660156 8.6875 2.453125 C 8.144531 3.253906 7.460938 3.953125 6.640625 4.546875 C 5.828125 5.148438 4.820312 5.59375 3.625 5.875 L 2.171875 3.328125 C 3.160156 3.109375 3.957031 2.753906 4.5625 2.265625 C 5.175781 1.785156 5.703125 1.171875 6.140625 0.421875 L 0.515625 -11.828125 L 4.75 -11.828125 L 7.875 -3.78125 Z M 10.625 -11.828125 "/>
        </g>
      </g>
      <g style={{fill: '#006cea', fillOpacity: 1}}>
        <g transform="translate(43.799222, 25.909254)">
          <path style={{stroke: 'none'}} d="M 12.71875 -6.265625 L 12.71875 -5.484375 L 4.78125 -3.90625 C 5.0625 -3.519531 5.414062 -3.210938 5.84375 -2.984375 C 6.28125 -2.753906 6.804688 -2.640625 7.421875 -2.640625 C 8.097656 -2.640625 8.695312 -2.734375 9.21875 -2.921875 C 9.75 -3.109375 10.269531 -3.382812 10.78125 -3.75 L 12.234375 -1.484375 C 11.484375 -0.878906 10.703125 -0.4375 9.890625 -0.15625 C 9.085938 0.125 8.265625 0.265625 7.421875 0.265625 C 6.085938 0.265625 4.921875 0.0078125 3.921875 -0.5 C 2.921875 -1.007812 2.140625 -1.734375 1.578125 -2.671875 C 1.023438 -3.609375 0.75 -4.707031 0.75 -5.96875 C 0.75 -7.269531 1.019531 -8.382812 1.5625 -9.3125 C 2.113281 -10.25 2.835938 -10.96875 3.734375 -11.46875 C 4.628906 -11.976562 5.613281 -12.234375 6.6875 -12.234375 C 8 -12.234375 9.101562 -11.953125 10 -11.390625 C 10.894531 -10.835938 11.570312 -10.109375 12.03125 -9.203125 C 12.488281 -8.296875 12.71875 -7.316406 12.71875 -6.265625 Z M 6.875 -9.328125 C 6.144531 -9.328125 5.53125 -9.082031 5.03125 -8.59375 C 4.539062 -8.113281 4.265625 -7.445312 4.203125 -6.59375 L 9.359375 -7.625 C 8.972656 -8.757812 8.144531 -9.328125 6.875 -9.328125 Z M 6.875 -9.328125 "/>
        </g>
      </g>
      <g clipRule="nonzero" clipPath="url(#48d9acdb08)">
        <path style={{stroke: 'none', fillRule: 'nonzero', fill: '#006cea', fillOpacity: 1}} d="M 53.925781 29.582031 C 53.925781 30.257812 53.378906 30.800781 52.703125 30.800781 L 48.183594 30.800781 C 47.511719 30.804688 46.964844 30.257812 46.964844 29.582031 C 46.964844 28.90625 47.511719 28.359375 48.183594 28.359375 L 52.699219 28.359375 C 53.378906 28.359375 53.925781 28.90625 53.925781 29.582031 Z M 53.925781 29.582031 "/>
      </g>
    </g>
  </svg>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    console.log('Iniciando processo de login...');
    
    // Simular um pequeno delay para melhor UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const success = login(email, password);
    if (success) {
      console.log('Login bem-sucedido, redirecionando para página principal...');
      navigate('/', { replace: true });
    } else {
      console.log('Falha no login');
      setError('E-mail ou senha incorretos');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <AnyeLogo />
        <button className="text-gray-600 hover:text-gray-800 text-sm">
          Voltar ao site
        </button>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-100 items-center justify-center">
          <div className="w-96 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-lg">Imagem ilustrativa</span>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl font-light text-gray-900 mb-2">
                Entrar
              </h1>
              <p className="text-gray-600">
                Digite seu e-mail e senha para acessar sua conta.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite seu e-mail"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Digite sua senha"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                  <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                  Esqueceu a senha?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                  Cadastre-se
                </a>
              </p>
            </div>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou continue com</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </button>

                <button className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

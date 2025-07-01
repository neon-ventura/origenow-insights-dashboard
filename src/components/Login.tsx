import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente SVG para o logo Anye
const AnyeLogo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="120" 
    height="75" 
    viewBox="0 0 60 37.5" 
    preserveAspectRatio="xMidYMid meet"
    className="h-12 w-auto"
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

// Componente SVG para o logo do Google
const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
    <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

// Componente SVG para o logo do Facebook
const FacebookLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M18 9C18 4.032 13.968 0 9 0S0 4.032 0 9c0 4.5 3.288 8.226 7.593 8.91V11.59H5.308V9h2.285V7.017c0-2.255 1.343-3.502 3.401-3.502.985 0 2.016.176 2.016.176v2.217h-1.136c-1.118 0-1.467.694-1.467 1.406V9h2.496l-.399 2.59h-2.097v6.32C14.712 17.226 18 13.5 18 9z" fill="#1877F2"/>
  </svg>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('Por favor, insira um e-mail válido');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!validateEmail(email)) {
      setEmailError('Por favor, insira um e-mail válido');
      setIsLoading(false);
      return;
    }

    console.log('Iniciando processo de login...');
    
    try {
      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Resposta do login:', data);

      if (data.status === 'success') {
        // Armazenar o token no localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('tokenType', data.token_type);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        console.log('Login bem-sucedido, redirecionando para página principal...');
        const success = login(email, password);
        if (success) {
          navigate('/', { replace: true });
        }
      } else {
        console.log('Falha no login:', data.message);
        setError(data.message || 'E-mail ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Erro de conexão. Tente novamente.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Barra superior */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <AnyeLogo />
        <a 
          href="https://www.anye.com.br/"
          className="text-sm text-gray-600 hover:underline focus:outline-none focus:underline"
          tabIndex={0}
        >
          Voltar ao site
        </a>
      </header>

      {/* Container principal */}
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Cabeçalho do formulário */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-normal text-gray-900 mb-2">Entrar</h1>
            <p className="text-gray-600 text-sm">Acesse sua conta Anye.</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo E-mail */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Digite seu e-mail"
                  className="w-full h-12 px-4 pl-10 border border-gray-300 rounded-md focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-colors"
                  required
                  tabIndex={1}
                />
                <Mail 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
                />
              </div>
              {emailError && (
                <div className="text-red-600 text-sm border-l-2 border-red-600 pl-3">
                  {emailError}
                </div>
              )}
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full h-12 px-4 pr-12 border border-gray-300 rounded-md focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none transition-colors"
                  required
                  tabIndex={2}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  tabIndex={3}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="text-red-600 text-sm border-l-2 border-red-600 pl-3">
                {error}
              </div>
            )}

            {/* Botão Acessar e Link Recuperar Senha */}
            <div className="flex items-center justify-between gap-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="px-8 py-2.5 text-white rounded-full hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-sm"
                style={{ backgroundColor: '#006cea' }}
                tabIndex={4}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Acessando...</span>
                  </div>
                ) : (
                  'Acessar'
                )}
              </Button>
              <button
                type="button"
                className="text-sm text-gray-600 hover:underline focus:outline-none focus:underline min-w-[44px] min-h-[44px] flex items-center"
                tabIndex={5}
              >
                Recuperar senha
              </button>
            </div>
          </form>

          {/* Divisor */}
          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-xs text-gray-500 bg-white">ou</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Botões sociais */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200"
              tabIndex={6}
            >
              <GoogleLogo />
              <span className="text-sm text-gray-700">Continuar com Google</span>
            </button>
            
            <button
              type="button"
              className="w-full h-12 flex items-center justify-center gap-3 border border-gray-300 rounded-md hover:bg-gray-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-200"
              tabIndex={7}
            >
              <FacebookLogo />
              <span className="text-sm text-gray-700">Continuar com Facebook</span>
            </button>
          </div>

          {/* Rodapé */}
          <div className="mt-8 space-y-2 text-center">
            <p className="text-sm text-gray-600">
              Não possui conta?{' '}
              <button 
                onClick={() => navigate('/register')}
                className="text-gray-900 hover:underline focus:outline-none focus:underline font-medium" 
                tabIndex={8}
              >
                Cadastrar
              </button>
            </p>
            <p className="text-sm text-gray-600">
              Precisa de ajuda?{' '}
              <button className="text-gray-900 hover:underline focus:outline-none focus:underline font-medium" tabIndex={9}>
                Suporte por Whatsapp
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};


import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { getActiveToken } from '@/utils/auth';

const AutorizacaoAmazonSucesso = () => {
  const [countdown, setCountdown] = useState(10);
  const [isUpdatingUser, setIsUpdatingUser] = useState(true);
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    const updateUserData = async () => {
      const token = getActiveToken();
      
      if (!token) {
        console.error('Token de autenticação não encontrado');
        setIsUpdatingUser(false);
        return;
      }

      try {
        console.log('Fazendo re-login com token para atualizar dados do usuário...');
        
        // Fazer chamada para o endpoint de login passando o token anterior
        const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/login', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token
          }),
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Dados do usuário atualizados via login:', data);
          
          if (data.status === 'success' && data.user) {
            // Atualizar localStorage com os novos dados e token
            if (data.token) {
              const expirationTime = Date.now() + (data.expires_in * 1000);
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('tokenExpiration', expirationTime.toString());
            }
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            toast({
              title: "Dados atualizados",
              description: "Suas informações foram sincronizadas com sucesso.",
            });
          }
        } else {
          console.log('Não foi possível atualizar os dados, mas continuando...');
        }
      } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        toast({
          title: "Aviso",
          description: "Não foi possível sincronizar todos os dados, mas você pode continuar usando a plataforma.",
        });
      } finally {
        setIsUpdatingUser(false);
      }
    };

    updateUserData();
  }, []);

  useEffect(() => {
    if (isUpdatingUser) return; // Não iniciar contador enquanto atualiza dados

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, isUpdatingUser]);

  const benefits = [
    {
      icon: CheckCircle,
      title: "Autorização concluída",
      description: "Sua conta Amazon Seller Central foi conectada com sucesso"
    },
    {
      icon: Shield,
      title: "Conexão segura",
      description: "Todos os dados são transmitidos de forma criptografada"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Autorização Concluída!</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Perfeito! Sua conta Amazon Seller Central foi conectada com sucesso. Agora você pode começar a usar todas as funcionalidades da nossa plataforma.
          </p>
        </div>

        {/* Main Success Card */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="space-y-6 p-6 lg:p-8">
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Next Steps */}
            <div className="bg-green-50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium text-green-900 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                O que você pode fazer agora:
              </h3>
              <div className="space-y-3 text-green-800">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                  <p className="text-sm">Visualizar e gerenciar seus produtos da Amazon</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                  <p className="text-sm">Acompanhar pedidos e vendas em tempo real</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                  <p className="text-sm">Publicar e atualizar ofertas automaticamente</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                  <p className="text-sm">Gerenciar estoque e fornecedores</p>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center pt-2">
              {isUpdatingUser ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-600">
                    Sincronizando seus dados...
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Você será redirecionado automaticamente para a dashboard em {countdown} segundos
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Success Notice */}
        <Card className="border-0 shadow-sm bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-900">Conexão Estabelecida com Sucesso</h3>
                <p className="text-green-700 text-sm">
                  Sua autorização da Amazon está ativa e você pode começar a usar todas as funcionalidades da plataforma imediatamente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutorizacaoAmazonSucesso;


import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ExternalLink, Shield, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const AutorizacaoAmazon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const authWindowRef = useRef<Window | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const checkAuthorizationStatus = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/webhook/amazon-auth', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          // Procurar por um registro com o user_id do usuário atual
          const userAuthLog = data.data.find((log: any) => 
            log.user_id === user.id && log.status === 'success'
          );

          if (userAuthLog) {
            console.log('Autorização detectada:', userAuthLog);
            
            // Parar o polling
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }

            // Fechar a janela anônima se ainda estiver aberta
            if (authWindowRef.current && !authWindowRef.current.closed) {
              authWindowRef.current.close();
            }

            // Mostrar toast de sucesso
            toast({
              title: "Autorização concluída!",
              description: "Sua conta Amazon foi conectada com sucesso.",
            });

            // Redirecionar para a página de sucesso
            navigate('/autorizacao-amazon-sucesso');
            return true;
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar status da autorização:', error);
    }
    
    return false;
  };

  const startPolling = () => {
    // Verificar imediatamente
    checkAuthorizationStatus();
    
    // Depois verificar a cada 3 segundos
    pollingIntervalRef.current = setInterval(async () => {
      const authCompleted = await checkAuthorizationStatus();
      if (authCompleted) {
        // O polling já foi parado na função checkAuthorizationStatus
        return;
      }
      
      // Verificar se a janela foi fechada manualmente
      if (authWindowRef.current && authWindowRef.current.closed) {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        setIsLoading(false);
        toast({
          title: "Processo cancelado",
          description: "A janela de autorização foi fechada. Tente novamente se não completou a autorização.",
        });
      }
    }, 3000);
  };

  const handleAuthorizeAmazon = async () => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "ID do usuário não encontrado. Faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const authUrl = `https://dev.huntdigital.com.br/projeto-amazon/auth/amazon?user_id=${user.id}`;
      
      // Configurações para centralizar a janela
      const width = 800;
      const height = 600;
      const left = (screen.width - width) / 2;
      const top = (screen.height - height) / 2;
      
      const windowFeatures = `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`;
      
      // Abrir em uma nova janela anônima/incógnita centralizada
      authWindowRef.current = window.open(authUrl, '_blank', windowFeatures);
      
      if (!authWindowRef.current) {
        toast({
          title: "Erro",
          description: "Não foi possível abrir a janela de autorização. Verifique se o bloqueador de pop-ups está desabilitado.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: "Autorização iniciada",
        description: "Complete o processo na nova janela. Esta página detectará automaticamente quando a autorização for concluída.",
      });

      // Iniciar o polling para verificar o status da autorização
      startPolling();

    } catch (error) {
      toast({
        title: "Erro na autorização",
        description: "Não foi possível iniciar o processo de autorização. Tente novamente.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Limpar o polling ao desmontar o componente
  React.useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      icon: Shield,
      title: "Conexão segura",
      description: "Utilizamos protocolos de segurança da própria Amazon"
    },
    {
      icon: Lock,
      title: "Dados protegidos",
      description: "Suas informações são criptografadas e seguras"
    }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Autorização Necessária</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-lg mx-auto">
            Para começar a usar nossa plataforma, você precisa autorizar o acesso à sua conta Amazon Seller Central
          </p>
        </div>

        {/* Main Authorization Card */}
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="space-y-6 p-6 lg:p-8">
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Authorization Steps */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="font-medium text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Como funciona a autorização:
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                  <p className="text-sm">Uma nova janela anônima será aberta para o Amazon Seller Central</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                  <p className="text-sm">Faça login com suas credenciais da Amazon na nova janela</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                  <p className="text-sm">Autorize o acesso à nossa aplicação</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                  <p className="text-sm">Esta página detectará automaticamente quando a autorização for concluída</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-2">
              <Button
                onClick={handleAuthorizeAmazon}
                disabled={isLoading}
                className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    {pollingIntervalRef.current ? 'Aguardando autorização...' : 'Abrindo janela...'}
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Conectar com Amazon
                  </>
                )}
              </Button>
              
              <p className="text-sm text-gray-500 mt-3">
                Ao conectar, você concorda com os termos de uso da Amazon SP-API
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-0 shadow-sm bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-900">Conexão 100% Segura</h3>
                <p className="text-green-700 text-sm">
                  Utilizamos os protocolos oficiais da Amazon SP-API. A página detectará automaticamente quando você completar a autorização.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AutorizacaoAmazon;

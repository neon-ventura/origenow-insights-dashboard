import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink, Shield, Zap, TrendingUp, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const AutorizacaoAmazon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleAuthorizeAmazon = async () => {
    setIsLoading(true);
    try {
      // Aqui você implementaria a lógica de autorização com Amazon
      // Por agora, simulo uma autorização bem-sucedida
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Autorização realizada com sucesso!",
        description: "Sua conta Amazon foi conectada e você pode começar a usar a plataforma.",
      });

      // Redirecionar para o dashboard ou salvar estado de autorização
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Erro na autorização",
        description: "Não foi possível conectar sua conta Amazon. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Sincronização automática",
      description: "Seus produtos e vendas são sincronizados automaticamente"
    },
    {
      icon: Zap,
      title: "Processamento rápido",
      description: "Atualizações em tempo real de estoque e preços"
    },
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Conectar Amazon</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Para começar a usar nossa plataforma, você precisa autorizar o acesso à sua conta Amazon Seller Central
          </p>
          <Badge variant="secondary" className="text-sm">
            Bem-vindo, {user?.nickname}!
          </Badge>
        </div>

        {/* Main Authorization Card */}
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-gray-900">Autorização Necessária</CardTitle>
            <CardDescription className="text-lg">
              Conecte sua conta Amazon para acessar todas as funcionalidades da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Authorization Steps */}
            <div className="bg-blue-50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Como funciona a autorização:
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">1</span>
                  <p>Você será redirecionado para o Amazon Seller Central</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">2</span>
                  <p>Faça login com suas credenciais da Amazon</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">3</span>
                  <p>Autorize o acesso à nossa aplicação</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">4</span>
                  <p>Você será redirecionado de volta e poderá usar a plataforma</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-4">
              <Button
                onClick={handleAuthorizeAmazon}
                disabled={isLoading}
                size="lg"
                className="w-full max-w-md bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 text-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Conectando...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-5 h-5 mr-2" />
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
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Conexão 100% Segura</h3>
                <p className="text-green-700 text-sm">
                  Utilizamos os protocolos oficiais da Amazon SP-API. Seus dados são protegidos e não armazenamos suas credenciais de login.
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
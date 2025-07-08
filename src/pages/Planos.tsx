import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Crown, Zap, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const Planos = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleSelectPlan = async (planName: string) => {
    setIsLoading(true);
    try {
      // Aqui você implementaria a lógica de seleção do plano
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Plano selecionado!",
        description: `Você selecionou o plano ${planName}. Redirecionando para pagamento...`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const plans = [
    {
      name: "Básico",
      price: "R$ 89",
      period: "/mês",
      description: "Ideal para pequenos vendedores",
      icon: Zap,
      features: [
        "Até 1.000 produtos",
        "Sincronização básica",
        "Suporte por email",
        "Relatórios básicos"
      ],
      buttonText: "Começar grátis",
      popular: false
    },
    {
      name: "Profissional",
      price: "R$ 159",
      period: "/mês",
      description: "Para vendedores em crescimento",
      icon: Crown,
      features: [
        "Até 10.000 produtos",
        "Sincronização em tempo real",
        "Suporte prioritário",
        "Relatórios avançados",
        "Automações personalizadas"
      ],
      buttonText: "Começar grátis",
      popular: true
    },
    {
      name: "Enterprise",
      price: "R$ 299",
      period: "/mês",
      description: "Para grandes operações",
      icon: Star,
      features: [
        "Produtos ilimitados",
        "Sincronização instantânea",
        "Suporte 24/7",
        "Relatórios customizados",
        "API dedicada",
        "Gerente de conta"
      ],
      buttonText: "Começar grátis",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Escolha seu Plano</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Todos os planos incluem 7 dias de avaliação gratuita. Cancele a qualquer momento.
          </p>
        </div>

        {/* Free Trial Banner */}
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div className="text-center">
                <h3 className="font-medium text-blue-900">Avaliação Gratuita de 7 Dias</h3>
                <p className="text-blue-700 text-sm">
                  Experimente todos os recursos sem compromisso
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`border-0 shadow-sm bg-white relative ${
                plan.popular ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </div>
                </div>
              )}
              
              <CardContent className="p-6 space-y-6">
                {/* Plan Header */}
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto">
                    <plan.icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">após período gratuito</p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={isLoading}
                  className={`w-full h-11 font-medium transition-colors ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Processando...
                    </>
                  ) : (
                    plan.buttonText
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Todos os planos incluem integração completa com Amazon Seller Central
          </p>
          <p className="text-xs text-gray-500">
            Preços em reais brasileiros. Cobrança mensal. Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Planos;
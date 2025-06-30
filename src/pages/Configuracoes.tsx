
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, MessageCircle, Star, Crown, Plug, CreditCard, Bell, User } from 'lucide-react';

const Configuracoes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState('amazon');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [whatsappNotifications, setWhatsappNotifications] = useState(true);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const planos = [
    {
      nome: 'Starter',
      preco: 'R$249,99/mês',
      descricao: 'Ideal para vendedores iniciantes no marketplace.',
      recursos: [
        'Painel de Fornecedores',
        'Compras Inteligentes',
        'Gestão de Autopeças',
        'Suporte por Email',
        '5 Usuários Inclusos',
        'Importação de até 1.000 produtos',
        'Alertas de preço básicos',
        'Relatórios semanais',
        'R$100 em créditos de anúncios'
      ],
      naoTem: [
        'Inteligência Artificial para Respostas',
        'Dashboard Personalizado',
        'API Exclusiva',
        'Gerente de Sucesso Dedicado'
      ]
    },
    {
      nome: 'Padrão',
      preco: 'R$399,99/mês',
      descricao: 'Para vendedores que buscam resultados consistentes.',
      recomendado: true,
      recursos: [
        'Todas funcionalidades do Plano Starter',
        'Inteligência Artificial para Respostas',
        'Avisos Inteligentes',
        'Suporte Prioritário',
        '10 Usuários Inclusos',
        'Importação de até 10.000 produtos',
        'Alertas de preço avançados',
        'Relatórios diários',
        'Otimização de títulos com IA',
        'R$300 em créditos de anúncios'
      ],
      naoTem: [
        'Dashboard Personalizado',
        'API Exclusiva',
        'Gerente de Sucesso Dedicado'
      ]
    },
    {
      nome: 'Enterprise',
      preco: 'R$899,99/mês',
      descricao: 'Solução completa para grandes operações.',
      recursos: [
        'Todas funcionalidades do Plano Padrão',
        'Dashboard Personalizado',
        'API Exclusiva',
        'Gerente de Sucesso Dedicado',
        'Usuários Ilimitados',
        'Integrações personalizadas',
        'Desenvolvimento de features exclusivas',
        'Consultoria estratégica mensal',
        'SLA garantido por contrato',
        'Créditos de anúncios personalizados'
      ],
      naoTem: []
    }
  ];

  return (
    <div className="flex min-h-screen w-full">
      <DraggableSidebar isCollapsed={isCollapsed} onToggle={handleToggle} />
      
      <div 
        className="flex-1 transition-all duration-300 ease-in-out"
        style={{ marginLeft: isCollapsed ? '88px' : '256px' }}
      >
        <Header />
        
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Configurações</h1>
            <p className="text-gray-600">Gerencie suas preferências e configurações da conta</p>
          </div>

          <Tabs defaultValue="integracoes" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="integracoes" className="flex items-center gap-2">
                <Plug className="w-4 h-4" />
                Integrações
              </TabsTrigger>
              <TabsTrigger value="faturamento" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Faturamento
              </TabsTrigger>
              <TabsTrigger value="notificacoes" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="perfil" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Perfil
              </TabsTrigger>
            </TabsList>

            {/* Tab Integrações */}
            <TabsContent value="integracoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor="integration">Selecionar Integração</Label>
                      <Select value={selectedIntegration} onValueChange={setSelectedIntegration}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma integração" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="amazon">Amazon</SelectItem>
                          <SelectItem value="mercado-livre">Mercado Livre</SelectItem>
                          <SelectItem value="shopee" disabled>Shopee (Em breve)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="mt-6">Configurar Chaves API</Button>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Status das Integrações</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Amazon</span>
                        <Badge variant="default">Conectado</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Mercado Livre</span>
                        <Badge variant="secondary">Disponível</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <span>Shopee</span>
                        <Badge variant="outline">Em breve</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Faturamento */}
            <TabsContent value="faturamento" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Planos e Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {planos.map((plano, index) => (
                      <div key={index} className={`border rounded-lg p-6 relative ${plano.recomendado ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
                        {plano.recomendado && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <Badge className="bg-blue-500 text-white">Recomendado</Badge>
                          </div>
                        )}
                        
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold flex items-center justify-center space-x-2">
                            <span>{plano.nome}</span>
                            {plano.nome === 'Enterprise' && <Crown className="w-5 h-5 text-yellow-500" />}
                          </h3>
                          <p className="text-2xl font-bold text-blue-600 mt-2">{plano.preco}</p>
                          <p className="text-sm text-gray-600 mt-1">{plano.descricao}</p>
                        </div>

                        <div className="space-y-3 mb-6">
                          {plano.recursos.map((recurso, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{recurso}</span>
                            </div>
                          ))}
                          
                          {plano.naoTem.length > 0 && (
                            <>
                              <hr className="my-3" />
                              <p className="text-sm font-medium text-gray-700 mb-2">Não inclui:</p>
                              {plano.naoTem.map((item, idx) => (
                                <div key={idx} className="flex items-start space-x-2">
                                  <span className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0">×</span>
                                  <span className="text-sm text-gray-500">{item}</span>
                                </div>
                              ))}
                            </>
                          )}
                        </div>

                        <Button className="w-full" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Fale Conosco
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Cupom de Desconto</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Input placeholder="Digite seu cupom de desconto" className="flex-1" />
                    <Button>Aplicar Cupom</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Convide Amigos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">Convide amigos com seu código e ganhe 10% de desconto para cada amigo que se inscrever!</p>
                    <div className="flex space-x-4">
                      <Input value="MEUCODIGO123" readOnly className="flex-1" />
                      <Button>Copiar Código</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Notificações */}
            <TabsContent value="notificacoes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-notifications">E-mail</Label>
                      <Switch 
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="sms-notifications">SMS</Label>
                      <Switch 
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="whatsapp-notifications">WhatsApp</Label>
                      <Switch 
                        id="whatsapp-notifications"
                        checked={whatsappNotifications}
                        onCheckedChange={setWhatsappNotifications}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab Perfil */}
            <TabsContent value="perfil" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input id="fullName" placeholder="Seu nome completo" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input id="phone" placeholder="(11) 99999-9999" />
                    </div>
                    <div>
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <Input id="currentPassword" type="password" placeholder="********" />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input id="newPassword" type="password" placeholder="********" />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <Input id="confirmPassword" type="password" placeholder="********" />
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button>Salvar Alterações</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;


import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Integracoes = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const integracoes = [
    {
      nome: 'Amazon',
      descricao: 'Integração com Amazon Marketplace para gestão de produtos e pedidos',
      status: 'Conectado',
      tipo: 'Marketplace'
    },
    {
      nome: 'Mercado Livre',
      descricao: 'Sincronização de produtos e estoque com Mercado Livre',
      status: 'Disponível',
      tipo: 'Marketplace'
    },
    {
      nome: 'Shopee',
      descricao: 'Gestão de anúncios e vendas na plataforma Shopee',
      status: 'Em breve',
      tipo: 'Marketplace'
    },
    {
      nome: 'API Personalizada',
      descricao: 'Conecte seu próprio sistema através de nossa API REST',
      status: 'Disponível',
      tipo: 'API'
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Integrações</h1>
            <p className="text-gray-600">Conecte sua conta com diferentes plataformas e serviços</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integracoes.map((integracao, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{integracao.nome}</CardTitle>
                    <Badge 
                      variant={
                        integracao.status === 'Conectado' ? 'default' :
                        integracao.status === 'Disponível' ? 'secondary' : 'outline'
                      }
                    >
                      {integracao.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 text-sm">{integracao.descricao}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{integracao.tipo}</Badge>
                    <Button
                      size="sm"
                      variant={integracao.status === 'Conectado' ? 'outline' : 'default'}
                      disabled={integracao.status === 'Em breve'}
                    >
                      {integracao.status === 'Conectado' ? 'Configurar' : 
                       integracao.status === 'Disponível' ? 'Conectar' : 'Em breve'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integracoes;

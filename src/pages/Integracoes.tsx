
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Settings } from 'lucide-react';

const Integracoes = () => {
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
      status: 'Em breve',
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
      status: 'Em breve',
      tipo: 'API'
    }
  ];

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Link className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
            <p className="text-gray-600 text-lg">Conecte sua conta com diferentes plataformas e serviços</p>
          </div>
        </div>
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
    </>
  );
};

export default Integracoes;

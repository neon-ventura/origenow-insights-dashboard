
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useUserContext } from '@/contexts/UserContext';

const Integracoes = () => {
  const { selectedUser } = useUserContext();
  
  const isAmazonConnected = selectedUser?.sellerId ? true : false;

  const integracoes = [
    {
      id: 1,
      nome: 'Amazon Brasil',
      descricao: 'Integração com marketplace da Amazon para venda de produtos no Brasil',
      status: isAmazonConnected ? 'Conectado' : 'Disponível',
      tipo: 'Marketplace',
      icone: '📦',
      isAmazon: true,
      nickname: selectedUser?.nickname || '',
      sellerId: selectedUser?.sellerId || ''
    },
    {
      id: 2,
      nome: 'Mercado Livre',
      descricao: 'Integração com marketplace do Mercado Livre para ampliar suas vendas',
      status: 'Em breve',
      tipo: 'Marketplace',
      icone: '🛒',
      isAmazon: false
    },
    {
      id: 3,
      nome: 'Shopee',
      descricao: 'Conecte-se ao Shopee e expanda suas vendas para toda América Latina',
      status: 'Em breve',
      tipo: 'Marketplace',
      icone: '🛍️',
      isAmazon: false
    },
    {
      id: 4,
      nome: 'Magalu',
      descricao: 'Integração com Magazine Luiza para vender seus produtos',
      status: 'Em breve',
      tipo: 'Marketplace',
      icone: '🏪',
      isAmazon: false
    }
  ];

  const handleConnectAmazon = () => {
    window.open('/autorizacao-amazon', '_blank');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Conectado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'Disponível':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ExternalLink className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrações</h1>
            <p className="text-gray-600 text-lg">Conecte sua loja com os principais marketplaces</p>
          </div>
        </div>
      </div>

      {/* Grid de Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integracoes.map((integracao) => (
          <Card key={integracao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{integracao.nome}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      integracao.status === 'Conectado' ? 'default' :
                      integracao.status === 'Disponível' ? 'secondary' : 'outline'
                    }
                    className={integracao.status === 'Conectado' ? 'bg-green-600 hover:bg-green-700' : ''}
                  >
                    {integracao.status}
                  </Badge>
                  {integracao.isAmazon && isAmazonConnected && (
                    <Badge variant="outline" className="text-xs">
                      {integracao.nickname}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{integracao.descricao}</p>
              
              <div className="flex items-center justify-between">
                <Badge variant="outline">{integracao.tipo}</Badge>
                <div className="flex items-center gap-2">
                  {getStatusIcon(integracao.status)}
                  <span className="text-2xl">{integracao.icone}</span>
                </div>
              </div>
              
              <div className="pt-2">
                {integracao.isAmazon ? (
                  isAmazonConnected ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleConnectAmazon}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Gerenciar Conexão
                    </Button>
                  ) : (
                    <Button 
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      onClick={handleConnectAmazon}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Conectar Amazon
                    </Button>
                  )
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    {integracao.status}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integracoes;

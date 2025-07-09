
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, Settings, Unlink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Integracoes = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Verificar se a conta Amazon está conectada
  const isAmazonConnected = currentUser?.sellerId && currentUser?.nickname;

  const handleConfigurarAmazon = () => {
    navigate('/autorizacao-amazon');
  };

  const handleDesconectarAmazon = () => {
    // TODO: Implementar lógica de desconexão
    console.log('Desconectar Amazon');
  };

  const integracoes = [
    {
      nome: 'Amazon',
      descricao: 'Integração com Amazon Marketplace para gestão de produtos e pedidos',
      status: isAmazonConnected ? 'Conectado' : 'Disponível',
      tipo: 'Marketplace',
      nickname: currentUser?.nickname,
      sellerId: currentUser?.sellerId,
      isAmazon: true
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
                  className={integracao.status === 'Conectado' ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {integracao.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 text-sm">{integracao.descricao}</p>
              
              {/* Mostrar informações da conta Amazon se conectada */}
              {integracao.isAmazon && isAmazonConnected && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium text-green-800">Nickname:</span>
                    <span className="ml-2 text-green-700">{integracao.nickname}</span>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium text-green-800">Seller ID:</span>
                    <span className="ml-2 text-green-700">{integracao.sellerId}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant="outline">{integracao.tipo}</Badge>
                
                {integracao.isAmazon ? (
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isAmazonConnected}
                      onClick={handleConfigurarAmazon}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Configurar
                    </Button>
                    
                    {isAmazonConnected && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleDesconectarAmazon}
                      >
                        <Unlink className="w-4 h-4 mr-1" />
                        Desconectar
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant={integracao.status === 'Conectado' ? 'outline' : 'default'}
                    disabled={integracao.status === 'Em breve'}
                  >
                    {integracao.status === 'Conectado' ? 'Configurar' : 
                     integracao.status === 'Disponível' ? 'Conectar' : 'Em breve'}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Integracoes;

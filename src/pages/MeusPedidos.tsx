
import React, { useState } from 'react';
import { DraggableSidebar } from '@/components/DraggableSidebar';
import { Header } from '@/components/Header';
import { PedidosTable } from '@/components/PedidosTable';
import { usePedidos } from '@/hooks/usePedidos';
import { useUserContext } from '@/contexts/UserContext';
import { Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const MeusPedidos = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { selectedUser } = useUserContext();
  const { data: pedidosData, isLoading, error } = usePedidos();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <DraggableSidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '64px' : '256px' }}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Título da Página */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Pedidos</h1>
              <p className="text-gray-600">
                Visualize e gerencie todos os seus pedidos da Amazon
              </p>
            </div>

            {/* Verificação se usuário está selecionado */}
            {!selectedUser?.nickname ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    Usuário não selecionado
                  </CardTitle>
                  <CardDescription>
                    Por favor, selecione um usuário no cabeçalho para visualizar os pedidos.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : isLoading ? (
              /* Estado de carregamento */
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Carregando pedidos...</p>
                  </div>
                </CardContent>
              </Card>
            ) : error ? (
              /* Estado de erro */
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="w-5 h-5" />
                    Erro ao carregar pedidos
                  </CardTitle>
                  <CardDescription>
                    Ocorreu um erro ao buscar os pedidos. Tente novamente mais tarde.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : pedidosData?.pedidos && pedidosData.pedidos.length > 0 ? (
              /* Lista de pedidos */
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Pedidos ({pedidosData.paginacao.total_itens})
                    </CardTitle>
                    <CardDescription>
                      Usuário: {selectedUser.nickname}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PedidosTable pedidos={pedidosData.pedidos} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              /* Estado vazio */
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum pedido encontrado
                  </h3>
                  <p className="text-gray-600">
                    Não há pedidos disponíveis para o usuário {selectedUser.nickname}.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MeusPedidos;

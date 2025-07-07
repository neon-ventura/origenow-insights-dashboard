
import React, { useState } from 'react';
import { PedidosMetrics } from '@/components/PedidosMetrics';
import { PedidosTable } from '@/components/PedidosTable';
import { usePedidos } from '@/hooks/usePedidos';
import { useUserContext } from '@/contexts/UserContext';
import { usePedidosFilters } from '@/hooks/usePedidosFilters';
import { Loader2, AlertCircle, ShoppingCart, Package } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSplash } from '@/components/LoadingSplash';

const MeusPedidos = () => {
  const { selectedUser } = useUserContext();
  const { filters, updateFilter, clearFilters } = usePedidosFilters();
  const [appliedFilters, setAppliedFilters] = useState({});
  const { data: pedidosData, isLoading, error } = usePedidos(appliedFilters);

  return (
    <>
      {/* Título da Página */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Pedidos</h1>
            <p className="text-gray-600 text-lg">Visualize e gerencie todos os seus pedidos da Amazon</p>
          </div>
        </div>
      </div>

      {/* Verificação se usuário está selecionado */}
      {!selectedUser?.nickname ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Usuário não selecionado
              </h3>
              <p className="text-gray-600">
                Por favor, selecione um usuário no cabeçalho para visualizar os pedidos.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Métricas dos Pedidos */}
          <PedidosMetrics />

          {/* Conteúdo dos Pedidos */}
          {isLoading ? (
            <LoadingSplash message="Carregando pedidos da Amazon..." />
          ) : error ? (
            /* Estado de erro */
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <AlertCircle className="w-8 h-8 mx-auto mb-4 text-red-500" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Erro ao carregar pedidos
                  </h3>
                  <p className="text-gray-600">
                    Ocorreu um erro ao buscar os pedidos. Tente novamente mais tarde.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : pedidosData?.pedidos && pedidosData.pedidos.length > 0 ? (
            /* Tabela de pedidos */
            <PedidosTable 
              pedidos={pedidosData.pedidos} 
              pagination={pedidosData.paginacao}
              filters={filters}
              onFilterChange={updateFilter}
              onClearFilters={clearFilters}
              onApplyFilters={() => setAppliedFilters({...filters})}
              opcoesFiltros={pedidosData.opcoes_filtros}
            />
          ) : (
            /* Estado vazio */
            <Card>
              <CardContent className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-gray-600">
                  Não há pedidos disponíveis para o usuário {selectedUser.nickname}.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </>
  );
};

export default MeusPedidos;

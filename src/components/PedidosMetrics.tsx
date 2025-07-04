
import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Package, DollarSign, Clock, TrendingUp } from 'lucide-react';
import { usePedidos } from '@/hooks/usePedidos';
import { useUserContext } from '@/contexts/UserContext';

export const PedidosMetrics = () => {
  const { selectedUser } = useUserContext();
  const { data, isLoading } = usePedidos();

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalPedidos = data.pedidos?.length || 0;
  const pedidosEnviados = data.pedidos?.filter(p => p.status.toLowerCase() === 'shipped').length || 0;
  const pedidosPendentes = data.pedidos?.filter(p => p.status.toLowerCase() === 'pending').length || 0;
  const valorTotal = data.pedidos?.reduce((sum, pedido) => sum + parseFloat(pedido.valor_total || '0'), 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total de Pedidos"
        value={totalPedidos.toLocaleString()}
        color="blue"
        icon={<Package className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Pedidos Enviados"
        value={pedidosEnviados.toLocaleString()}
        color="green"
        icon={<TrendingUp className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Pedidos Pendentes"
        value={pedidosPendentes.toLocaleString()}
        color="orange"
        icon={<Clock className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Valor Total"
        value={new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(valorTotal)}
        color="purple"
        icon={<DollarSign className="w-5 h-5" />}
      />
    </div>
  );
};

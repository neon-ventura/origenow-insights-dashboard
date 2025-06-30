
import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Package, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';

export const ProductMetrics = () => {
  const { selectedUser } = useUserContext();
  
  const { data, isLoading } = useAmazonProducts(
    selectedUser?.user,
    selectedUser?.sellerId,
    1,
    {}
  );

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

  const totalProdutos = data.resumo?.total_produtos || 0;
  const produtosAtivos = data.resumo?.produtos_ativos || 0;
  const produtosInativos = data.resumo?.produtos_inativos || 0;
  const vendasMes = data.resumo?.vendas_mes || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total de Produtos"
        value={totalProdutos.toLocaleString()}
        color="blue"
        icon={<Package className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Produtos Ativos"
        value={produtosAtivos.toLocaleString()}
        color="green"
        icon={<TrendingUp className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Produtos Inativos"
        value={produtosInativos.toLocaleString()}
        color="orange"
        icon={<AlertCircle className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Vendas do Mês"
        value={vendasMes.toLocaleString()}
        color="purple"
        icon={<DollarSign className="w-5 h-5" />}
      />
    </div>
  );
};

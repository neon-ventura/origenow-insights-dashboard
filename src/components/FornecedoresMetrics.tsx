
import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Package, ShoppingCart, AlertTriangle } from 'lucide-react';
import { useFornecedoresProducts } from '@/hooks/useFornecedoresProducts';
import { useUserContext } from '@/contexts/UserContext';

interface FornecedoresMetricsProps {
  currentPage: number;
  appliedFilters?: Record<string, any>;
}

export const FornecedoresMetrics = ({ currentPage, appliedFilters = {} }: FornecedoresMetricsProps) => {
  const { selectedUser } = useUserContext();
  
  const { data, isLoading } = useFornecedoresProducts(
    selectedUser?.sellerId,
    selectedUser?.user,
    currentPage,
    appliedFilters
  );

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalProdutos = data.resumo?.total_produtos || 0;
  const produtosCadastrados = data.resumo?.total_produtos_ja_cadastrados || 0;
  const produtosNaoCadastrados = data.resumo?.total_produtos_nao_cadastrados || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <MetricCard
        title="Total de Produtos"
        value={totalProdutos.toLocaleString()}
        color="blue"
        icon={<Package className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Produtos Cadastrados"
        value={produtosCadastrados.toLocaleString()}
        color="green"
        icon={<ShoppingCart className="w-5 h-5" />}
      />
      
      <MetricCard
        title="Produtos Não Cadastrados"
        value={produtosNaoCadastrados.toLocaleString()}
        color="orange"
        icon={<AlertTriangle className="w-5 h-5" />}
      />
    </div>
  );
};

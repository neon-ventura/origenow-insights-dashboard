
import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Package, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';

export const ProductMetrics = () => {
  const { selectedUser } = useUserContext();
  const { data, isLoading } = useAmazonProducts(
    selectedUser?.user,
    selectedUser?.sellerId
  );

  // Use data from API summary if available, otherwise calculate from products
  const products = data?.produtos || [];
  const summary = data?.resumo;
  
  const totalProducts = summary?.total_produtos || products.length;
  const activeProducts = summary?.produtos_ativos || products.filter(p => p.status === 'Active').length;
  const inactiveProducts = summary?.produtos_inativos || products.filter(p => p.status === 'Inactive').length;
  const averageActiveDays = summary?.media_dias_ativos || (products.length > 0 
    ? Math.round(products.reduce((sum, p) => sum + parseInt(p.dias_ativo || '0'), 0) / products.length)
    : 0);

  if (!selectedUser) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Produtos"
          value="—"
          color="blue"
          icon={<Package className="w-4 h-4" />}
        />
        <MetricCard
          title="Produtos Ativos"
          value="—"
          color="green"
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <MetricCard
          title="Produtos Inativos"
          value="—"
          color="purple"
          icon={<XCircle className="w-4 h-4" />}
        />
        <MetricCard
          title="Média de Dias Ativos"
          value="—"
          color="teal"
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total de Produtos"
          value="..."
          color="blue"
          icon={<Package className="w-4 h-4" />}
        />
        <MetricCard
          title="Produtos Ativos"
          value="..."
          color="green"
          icon={<CheckCircle className="w-4 h-4" />}
        />
        <MetricCard
          title="Produtos Inativos"
          value="..."
          color="purple"
          icon={<XCircle className="w-4 h-4" />}
        />
        <MetricCard
          title="Média de Dias Ativos"
          value="..."
          color="teal"
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total de Produtos"
        value={totalProducts.toLocaleString('pt-BR')}
        color="blue"
        icon={<Package className="w-4 h-4" />}
      />
      <MetricCard
        title="Produtos Ativos"
        value={activeProducts.toLocaleString('pt-BR')}
        color="green"
        icon={<CheckCircle className="w-4 h-4" />}
      />
      <MetricCard
        title="Produtos Inativos"
        value={inactiveProducts.toLocaleString('pt-BR')}
        color="purple"
        icon={<XCircle className="w-4 h-4" />}
      />
      <MetricCard
        title="Média de Dias Ativos"
        value={averageActiveDays.toLocaleString('pt-BR')}
        color="teal"
        icon={<Calendar className="w-4 h-4" />}
      />
    </div>
  );
};

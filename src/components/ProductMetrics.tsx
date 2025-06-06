import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Package, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';
import Loader from '@/components/Loader';

export const ProductMetrics = () => {
  const { selectedUser } = useUserContext();
  const { data: products = [], isLoading } = useAmazonProducts(
    selectedUser?.user,
    selectedUser?.sellerId
  );

  // Cálculo das métricas baseado nos dados reais
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'Active').length;
  const inactiveProducts = products.filter(p => p.status === 'Inactive').length;
  
  // Cálculo da média de dias ativos
  const averageActiveDays = products.length > 0 
    ? Math.round(products.reduce((sum, p) => sum + parseInt(p.dias_ativo || '0'), 0) / products.length)
    : 0;

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
      <div className="mb-8 flex justify-center">
        <Loader />
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

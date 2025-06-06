
import React from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Package, CheckCircle, XCircle, Calendar } from 'lucide-react';

export const ProductMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <MetricCard
        title="Total de Produtos"
        value="1.247"
        change={5.2}
        changeLabel="vs mês anterior"
        color="blue"
        icon={<Package className="w-4 h-4" />}
      />
      <MetricCard
        title="Produtos Ativos"
        value="1.186"
        change={3.1}
        changeLabel="vs mês anterior"
        color="green"
        icon={<CheckCircle className="w-4 h-4" />}
      />
      <MetricCard
        title="Produtos Inativos"
        value="61"
        change={-12.5}
        changeLabel="vs mês anterior"
        color="purple"
        icon={<XCircle className="w-4 h-4" />}
      />
      <MetricCard
        title="Média de Dias Ativos"
        value="127"
        change={8.7}
        changeLabel="vs mês anterior"
        color="teal"
        icon={<Calendar className="w-4 h-4" />}
      />
    </div>
  );
};


import React, { useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { Package, CheckCircle, XCircle, Calendar, Users, Building, Edit } from 'lucide-react';
import { useAmazonProducts } from '@/hooks/useAmazonProducts';
import { useUserContext } from '@/contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface MetricConfig {
  id: string;
  title: string;
  dataKey: keyof any;
  color: 'blue' | 'green' | 'purple' | 'teal' | 'orange' | 'indigo';
  icon: React.ReactNode;
  defaultVisible: boolean;
}

const availableMetrics: MetricConfig[] = [
  {
    id: 'total_produtos',
    title: 'Total de Produtos',
    dataKey: 'total_produtos',
    color: 'blue',
    icon: <Package className="w-4 h-4" />,
    defaultVisible: true,
  },
  {
    id: 'produtos_ativos',
    title: 'Produtos Ativos',
    dataKey: 'produtos_ativos',
    color: 'green',
    icon: <CheckCircle className="w-4 h-4" />,
    defaultVisible: true,
  },
  {
    id: 'produtos_inativos',
    title: 'Produtos Inativos',
    dataKey: 'produtos_inativos',
    color: 'purple',
    icon: <XCircle className="w-4 h-4" />,
    defaultVisible: true,
  },
  {
    id: 'media_dias_ativos',
    title: 'Média de Dias Ativos',
    dataKey: 'media_dias_ativos',
    color: 'teal',
    icon: <Calendar className="w-4 h-4" />,
    defaultVisible: true,
  },
  {
    id: 'total_produtos_fornecedores',
    title: 'Produtos Fornecedores',
    dataKey: 'total_produtos_fornecedores',
    color: 'orange',
    icon: <Users className="w-4 h-4" />,
    defaultVisible: false,
  },
  {
    id: 'total_produtos_proprios',
    title: 'Produtos Próprios',
    dataKey: 'total_produtos_proprios',
    color: 'indigo',
    icon: <Building className="w-4 h-4" />,
    defaultVisible: false,
  },
];

export const ProductMetrics = () => {
  const { selectedUser } = useUserContext();
  const { data, isLoading } = useAmazonProducts(
    selectedUser?.user,
    selectedUser?.sellerId
  );

  const [visibleMetrics, setVisibleMetrics] = useState<string[]>(
    availableMetrics.filter(m => m.defaultVisible).map(m => m.id)
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Use data from API summary if available, otherwise calculate from products
  const products = data?.produtos || [];
  const summary = data?.resumo;

  const handleMetricToggle = (metricId: string) => {
    setVisibleMetrics(prev => 
      prev.includes(metricId) 
        ? prev.filter(id => id !== metricId)
        : [...prev, metricId]
    );
  };

  const getMetricValue = (metric: MetricConfig) => {
    if (!selectedUser) return '—';
    if (isLoading) return '...';
    
    const value = summary?.[metric.dataKey] || 0;
    return value.toLocaleString('pt-BR');
  };

  const filteredMetrics = availableMetrics.filter(metric => 
    visibleMetrics.includes(metric.id)
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Métricas dos Produtos</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-2 border-gray-200 text-gray-600 hover:bg-gray-50">
              <Edit className="w-4 h-4" />
              <span>Configurar Métricas</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Configurar Métricas Exibidas</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {availableMetrics.map((metric) => (
                <div key={metric.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={metric.id}
                    checked={visibleMetrics.includes(metric.id)}
                    onCheckedChange={() => handleMetricToggle(metric.id)}
                  />
                  <label 
                    htmlFor={metric.id} 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center space-x-2"
                  >
                    {metric.icon}
                    <span>{metric.title}</span>
                    {metric.defaultVisible && (
                      <span className="text-xs text-gray-500">(Padrão)</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setIsDialogOpen(false)}>
                Salvar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={getMetricValue(metric)}
            color={metric.color}
            icon={metric.icon}
          />
        ))}
      </div>
    </div>
  );
};

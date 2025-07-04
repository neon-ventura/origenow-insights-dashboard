
import { useState } from 'react';

interface FilterOptions {
  valorMin: number | null;
  valorMax: number | null;
  status: string;
  cidade: string;
  estado: string;
}

export const usePedidosFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    valorMin: null,
    valorMax: null,
    status: 'all',
    cidade: '',
    estado: '',
  });

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      valorMin: null,
      valorMax: null,
      status: 'all',
      cidade: '',
      estado: '',
    });
  };

  return {
    filters,
    updateFilter,
    clearFilters,
  };
};

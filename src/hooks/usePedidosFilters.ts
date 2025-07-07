
import { useState } from 'react';

interface FilterOptions {
  search: string;
  status: string;
  cidade: string;
  estado: string;
  intervalo: string;
  data_inicial: string;
  data_final: string;
  limit: number;
  page: number;
}

export const usePedidosFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: '',
    cidade: '',
    estado: '',
    intervalo: '',
    data_inicial: '',
    data_final: '',
    limit: 250,
    page: 1,
  });

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      cidade: '',
      estado: '',
      intervalo: '',
      data_inicial: '',
      data_final: '',
      limit: 250,
      page: 1,
    });
  };

  return {
    filters,
    updateFilter,
    clearFilters,
  };
};


import { useState } from 'react';

interface FilterOptions {
  precoMin: number | null;
  precoMax: number | null;
  statusProduto: string;
  tipo_produto: string;
  statusErro: string;
  estoqueMin: number | null;
  estoqueMax: number | null;
  status: string;
}

export const useProductFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    precoMin: null,
    precoMax: null,
    statusProduto: 'all',
    tipo_produto: 'all',
    statusErro: 'all',
    estoqueMin: null,
    estoqueMax: null,
    status: 'all',
  });

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      precoMin: null,
      precoMax: null,
      statusProduto: 'all',
      tipo_produto: 'all',
      statusErro: 'all',
      estoqueMin: null,
      estoqueMax: null,
      status: 'all',
    });
  };

  return {
    filters,
    updateFilter,
    clearFilters,
  };
};

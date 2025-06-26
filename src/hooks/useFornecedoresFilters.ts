
import { useState } from 'react';

interface FornecedoresFilters {
  precoMin: number | null;
  precoMax: number | null;
  custoMin: number | null;
  custoMax: number | null;
  estoqueMin: number | null;
  estoqueMax: number | null;
  fornecedor: string;
}

export const useFornecedoresFilters = () => {
  const [filters, setFilters] = useState<FornecedoresFilters>({
    precoMin: null,
    precoMax: null,
    custoMin: null,
    custoMax: null,
    estoqueMin: null,
    estoqueMax: null,
    fornecedor: '',
  });

  const updateFilter = (key: keyof FornecedoresFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      precoMin: null,
      precoMax: null,
      custoMin: null,
      custoMax: null,
      estoqueMin: null,
      estoqueMax: null,
      fornecedor: '',
    });
  };

  const buildFilterParams = () => {
    const params: Record<string, string> = {};
    
    if (filters.precoMin !== null) params.precoMin = filters.precoMin.toString();
    if (filters.precoMax !== null) params.precoMax = filters.precoMax.toString();
    if (filters.custoMin !== null) params.custoMin = filters.custoMin.toString();
    if (filters.custoMax !== null) params.custoMax = filters.custoMax.toString();
    if (filters.estoqueMin !== null) params.estoqueMin = filters.estoqueMin.toString();
    if (filters.estoqueMax !== null) params.estoqueMax = filters.estoqueMax.toString();
    if (filters.fornecedor) params.fornecedor = filters.fornecedor;
    
    return params;
  };

  return {
    filters,
    updateFilter,
    clearFilters,
    buildFilterParams,
  };
};

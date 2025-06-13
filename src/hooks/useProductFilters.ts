
import { useState, useMemo } from 'react';

interface AmazonProduct {
  asin: string;
  sku: string;
  status: string;
  titulo: string;
  preço: string;
  quantidade: string;
  data_criação: string;
  nickname: string;
  usuario: string;
  ultimo_relatorio: string;
  dias_ativo: string;
  menor_preco: string | null;
  preco_recomendado: string | null;
}

interface FilterOptions {
  status: string;
  minPrice: number | null;
  maxPrice: number | null;
  minStock: number | null;
  maxStock: number | null;
}

export const useProductFilters = (products: AmazonProduct[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    minPrice: null,
    maxPrice: null,
    minStock: null,
    maxStock: null,
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Status filter
      if (filters.status && filters.status !== 'all' && product.status !== filters.status) {
        return false;
      }

      // Stock filters
      const stock = parseInt(product.quantidade);
      if (filters.minStock !== null && stock < filters.minStock) {
        return false;
      }
      if (filters.maxStock !== null && stock > filters.maxStock) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      minPrice: null,
      maxPrice: null,
      minStock: null,
      maxStock: null,
    });
  };

  return {
    filters,
    filteredProducts,
    updateFilter,
    clearFilters,
  };
};

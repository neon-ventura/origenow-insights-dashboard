
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
  searchTerm: string;
  minPrice: number | null;
  maxPrice: number | null;
  minStock: number | null;
  maxStock: number | null;
}

export const useProductFilters = (products: AmazonProduct[]) => {
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    searchTerm: '',
    minPrice: null,
    maxPrice: null,
    minStock: null,
    maxStock: null,
  });

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Status filter
      if (filters.status && product.status !== filters.status) {
        return false;
      }

      // Search term filter (busca no título, SKU ou ASIN)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          product.titulo.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.asin.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Price filters
      const price = parseFloat(product.preço);
      if (filters.minPrice !== null && price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice !== null && price > filters.maxPrice) {
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
      status: '',
      searchTerm: '',
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


import { useQuery } from '@tanstack/react-query';

interface AmazonProduct {
  asin: string;
  sku: string;
  status: string;
  titulo: string;
  preço: string | null;
  quantidade: string;
  data_criação: string;
  nickname: string;
  usuario: string;
  ultimo_relatorio: string;
  dias_ativo: string;
  menor_preco: string | null;
  preco_recomendado: string | null;
  status_erro?: string;
  descricao_erro?: string | null;
}

interface PaginationInfo {
  pagina_atual: number;
  total_paginas: number;
  total_itens: number;
  itens_por_pagina: number;
}

interface ProductSummary {
  total_produtos: number;
  produtos_ativos: number;
  produtos_inativos: number;
  media_dias_ativos: number;
  vendas_mes?: number;
  total_produtos_fornecedores?: number;
  total_produtos_proprios?: number;
}

interface AmazonProductsResponse {
  produtos: AmazonProduct[];
  paginacao: PaginationInfo;
  resumo: ProductSummary;
}

interface FilterParams {
  searchTerm?: string;
  precoMin?: number | null;
  precoMax?: number | null;
  statusProduto?: string;
  tipo_produto?: string;
  statusErro?: string;
  estoqueMin?: number | null;
  estoqueMax?: number | null;
}

const fetchAmazonProducts = async (
  page: number = 1,
  filters: FilterParams = {}
): Promise<AmazonProductsResponse> => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const params = new URLSearchParams({
    page: page.toString(),
  });
  
  if (filters.searchTerm && filters.searchTerm.trim()) {
    params.append('search', filters.searchTerm.trim());
  }
  
  if (filters.precoMin !== undefined && filters.precoMin !== null) {
    params.append('precoMin', filters.precoMin.toString());
  }
  
  if (filters.precoMax !== undefined && filters.precoMax !== null) {
    params.append('precoMax', filters.precoMax.toString());
  }

  if (filters.statusProduto && filters.statusProduto !== 'all') {
    params.append('statusProduto', encodeURIComponent(filters.statusProduto));
  }

  if (filters.tipo_produto && filters.tipo_produto !== 'all') {
    params.append('tipo_produto', encodeURIComponent(filters.tipo_produto));
  }

  if (filters.statusErro && filters.statusErro !== 'all') {
    params.append('statusErro', encodeURIComponent(filters.statusErro));
  }

  if (filters.estoqueMin !== undefined && filters.estoqueMin !== null) {
    params.append('estoqueMin', filters.estoqueMin.toString());
  }
  
  if (filters.estoqueMax !== undefined && filters.estoqueMax !== null) {
    params.append('estoqueMax', filters.estoqueMax.toString());
  }

  const url = `https://dev.huntdigital.com.br/projeto-amazon/produtos-amazon?${params.toString()}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Amazon products');
  }
  return response.json();
};

export const useAmazonProducts = (
  page: number = 1,
  filters: FilterParams = {}
) => {
  return useQuery({
    queryKey: ['amazon-products', page, filters],
    queryFn: () => fetchAmazonProducts(page, filters),
  });
};

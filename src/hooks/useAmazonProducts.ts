
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
  user: string, 
  sellerId: string, 
  page: number = 1,
  filters: FilterParams = {}
): Promise<AmazonProductsResponse> => {
  let url = `https://dev.huntdigital.com.br/projeto-amazon/produtos-amazon?user=${user}&sellerId=${sellerId}&page=${page}`;
  
  if (filters.searchTerm && filters.searchTerm.trim()) {
    url += `&search=${encodeURIComponent(filters.searchTerm.trim())}`;
  }
  
  if (filters.precoMin !== undefined && filters.precoMin !== null) {
    url += `&precoMin=${filters.precoMin}`;
  }
  
  if (filters.precoMax !== undefined && filters.precoMax !== null) {
    url += `&precoMax=${filters.precoMax}`;
  }

  if (filters.statusProduto && filters.statusProduto !== 'all') {
    url += `&statusProduto=${encodeURIComponent(filters.statusProduto)}`;
  }

  if (filters.tipo_produto && filters.tipo_produto !== 'all') {
    url += `&tipo_produto=${encodeURIComponent(filters.tipo_produto)}`;
  }

  if (filters.statusErro && filters.statusErro !== 'all') {
    url += `&statusErro=${encodeURIComponent(filters.statusErro)}`;
  }

  if (filters.estoqueMin !== undefined && filters.estoqueMin !== null) {
    url += `&estoqueMin=${filters.estoqueMin}`;
  }
  
  if (filters.estoqueMax !== undefined && filters.estoqueMax !== null) {
    url += `&estoqueMax=${filters.estoqueMax}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch Amazon products');
  }
  return response.json();
};

export const useAmazonProducts = (
  user?: string, 
  sellerId?: string, 
  page: number = 1,
  filters: FilterParams = {}
) => {
  return useQuery({
    queryKey: ['amazon-products', user, sellerId, page, filters],
    queryFn: () => fetchAmazonProducts(user!, sellerId!, page, filters),
    enabled: !!(user && sellerId),
  });
};

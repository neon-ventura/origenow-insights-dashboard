
import { useQuery } from '@tanstack/react-query';

interface FornecedorProduct {
  sku: number;
  asin: string;
  codigo_fornecedor: string;
  descricao: string;
  marca: string;
  custo: string;
  valor_recomendado: string;
  estoque: string;
  gtin: string;
  fornecedor: string;
}

interface Paginacao {
  pagina_atual: number;
  total_paginas: number;
  total_itens: number;
  itens_por_pagina: number;
}

interface Resumo {
  total_produtos_ja_cadastrados: number;
  total_produtos_nao_cadastrados: number;
  total_produtos: number;
  total_produtos_filtrados: number;
}

interface FornecedoresResponse {
  produtos: FornecedorProduct[];
  paginacao: Paginacao;
  resumo: Resumo;
  filtros_disponiveis?: any;
}

interface FornecedoresFilters {
  precoMin?: number;
  precoMax?: number;
  custoMin?: number;
  custoMax?: number;
  estoqueMin?: number;
  estoqueMax?: number;
  fornecedor?: string;
}

const fetchFornecedoresProducts = async (
  sellerId: string,
  usuario: string,
  page: number = 1,
  filters: FornecedoresFilters = {}
): Promise<FornecedoresResponse> => {
  const params = new URLSearchParams({
    sellerId,
    usuario,
    page: page.toString(),
  });

  // Adicionar filtros aos parâmetros
  if (filters.precoMin !== undefined && filters.precoMin !== null) {
    params.append('precoMin', filters.precoMin.toString());
  }
  if (filters.precoMax !== undefined && filters.precoMax !== null) {
    params.append('precoMax', filters.precoMax.toString());
  }
  if (filters.custoMin !== undefined && filters.custoMin !== null) {
    params.append('custoMin', filters.custoMin.toString());
  }
  if (filters.custoMax !== undefined && filters.custoMax !== null) {
    params.append('custoMax', filters.custoMax.toString());
  }
  if (filters.estoqueMin !== undefined && filters.estoqueMin !== null) {
    params.append('estoqueMin', filters.estoqueMin.toString());
  }
  if (filters.estoqueMax !== undefined && filters.estoqueMax !== null) {
    params.append('estoqueMax', filters.estoqueMax.toString());
  }
  if (filters.fornecedor) {
    params.append('fornecedor', filters.fornecedor);
  }

  const url = `https://dev.huntdigital.com.br/projeto-amazon/fornecedores?${params.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch supplier products');
  }
  return response.json();
};

export const useFornecedoresProducts = (
  sellerId?: string, 
  usuario?: string, 
  page: number = 1,
  filters: FornecedoresFilters = {}
) => {
  return useQuery({
    queryKey: ['fornecedores-products', sellerId, usuario, page, filters],
    queryFn: () => fetchFornecedoresProducts(sellerId!, usuario!, page, filters),
    enabled: !!(sellerId && usuario),
  });
};

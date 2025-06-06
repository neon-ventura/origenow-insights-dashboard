
import { useQuery } from '@tanstack/react-query';

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

const fetchAmazonProducts = async (user: string, sellerId: string): Promise<AmazonProduct[]> => {
  const response = await fetch(`https://dev.huntdigital.com.br/projeto-amazon/produtos-amazon?user=${user}&sellerId=${sellerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch Amazon products');
  }
  return response.json();
};

export const useAmazonProducts = (user?: string, sellerId?: string) => {
  return useQuery({
    queryKey: ['amazon-products', user, sellerId],
    queryFn: () => fetchAmazonProducts(user!, sellerId!),
    enabled: !!(user && sellerId),
  });
};

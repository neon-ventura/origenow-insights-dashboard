
import { useQuery } from '@tanstack/react-query';
import { getActiveToken } from '@/utils/auth';

interface FornecedoresListResponse {
  status: string;
  total: number;
  fornecedores: string[];
}

const fetchFornecedoresList = async (): Promise<FornecedoresListResponse> => {
  const token = getActiveToken();
  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/fornecedores-lista', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch suppliers list');
  }
  return response.json();
};

export const useFornecedoresList = () => {
  return useQuery({
    queryKey: ['fornecedores-list'],
    queryFn: fetchFornecedoresList,
  });
};

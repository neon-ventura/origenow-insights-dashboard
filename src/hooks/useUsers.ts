
import { useQuery } from '@tanstack/react-query';

interface User {
  user: string;
  nickname: string | null;
  sellerId: string | null;
}

const fetchUsers = async (): Promise<User[]> => {
  console.log('Iniciando fetch de usuários...');
  
  try {
    const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/users');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Dados recebidos da API:', data);
    
    // Filtrar apenas os usuários Pedro e Pena Parts
    const allowedUsers = ['pedro', 'pena parts'];
    const filteredUsers = data.filter((user: User) => 
      user.user && allowedUsers.includes(user.user.toLowerCase())
    );
    
    console.log('Usuários filtrados:', filteredUsers);
    return filteredUsers;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });
};

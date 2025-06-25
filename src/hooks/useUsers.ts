
import { useQuery } from '@tanstack/react-query';

interface User {
  user: string;
  nickname: string | null;
  sellerId: string | null;
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  const data = await response.json();
  
  // Filtrar apenas os usuários Pedro e Pena Parts
  const allowedUsers = ['pedro', 'pena parts'];
  return data.filter((user: User) => 
    user.user && allowedUsers.includes(user.user.toLowerCase())
  );
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

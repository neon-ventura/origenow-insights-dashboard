
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
  return response.json();
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

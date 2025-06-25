
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
  const users = await response.json();
  
  // Filter out ALL users with the name "Pedro" (including "PEDRO", "Pedro", etc.)
  return users.filter((user: User) => user.user.toUpperCase() !== 'PEDRO');
};

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};

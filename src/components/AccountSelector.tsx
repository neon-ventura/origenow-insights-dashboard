import React, { useState, useMemo } from 'react';
import { ChevronDown, User as UserIcon, LogOut, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

export const AccountSelector = () => {
  const { user, currentUser, isSecondaryUser, isSwitchingUser, switchUser, switchBackToMainUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { data: usersData, isLoading: isLoadingUsers } = useUsers(searchTerm);

  // Filtrar usuários baseado na pesquisa local também (backup)
  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    return usersData.filter((u: any) => 
      u.id !== user?.id && 
      (u.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) || 
       u.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       u.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [usersData, user?.id, searchTerm]);

  // Só mostrar para usuário ID 1
  if (!user || user.id !== 1) {
    return null;
  }

  const handleUserSwitch = async (userId: number) => {
    if (userId === user.id) {
      // Voltar para conta principal
      switchBackToMainUser();
      toast.success('Voltou para sua conta principal');
    } else {
      try {
        const success = await switchUser(userId);
        if (success) {
          toast.success('Conta alternada com sucesso');
        } else {
          toast.error('Erro ao alternar conta');
        }
      } catch (error) {
        console.error('Erro ao alternar conta:', error);
        toast.error('Erro ao alternar conta');
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex flex-col items-start gap-1 px-3 py-2 text-sm h-auto w-full"
          disabled={isSwitchingUser || isLoadingUsers}
        >
          <div className="flex items-center gap-2 w-full">
            <UserIcon className="w-4 h-4" />
            <span className="flex-1 truncate text-left">
              {currentUser?.nickname || currentUser?.user || 'Carregando...'}
            </span>
            <ChevronDown className="w-4 h-4" />
          </div>
          {isSecondaryUser && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded ml-6">
              Alternativa
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-200 shadow-lg max-h-96 overflow-y-auto">
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">Alternar Conta</p>
          <p className="text-xs text-gray-500">
            Conta atual: {currentUser?.nickname || currentUser?.user}
          </p>
        </div>

        {/* Barra de pesquisa */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Pesquisar conta..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>
        
        {/* Conta principal */}
        <DropdownMenuItem
          onClick={() => handleUserSwitch(user.id)}
          className={`flex items-center gap-2 px-3 py-2 ${!isSecondaryUser ? 'bg-blue-50 text-blue-700' : ''}`}
        >
          <UserIcon className="w-4 h-4" />
          <div className="flex-1">
            <p className="text-sm font-medium">{user.nickname || user.user}</p>
            <p className="text-xs text-gray-500">Conta Principal</p>
          </div>
          {!isSecondaryUser && <span className="text-xs">Ativa</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Outras contas */}
        {isLoadingUsers ? (
          <div className="px-3 py-2 text-sm text-gray-500">Carregando usuários...</div>
        ) : filteredUsers.length === 0 && searchTerm ? (
          <div className="px-3 py-2 text-sm text-gray-500">Nenhuma conta encontrada</div>
        ) : (
          filteredUsers.map((u: any) => (
            <DropdownMenuItem
              key={u.id}
              onClick={() => handleUserSwitch(u.id)}
              className={`flex items-center gap-2 px-3 py-2 ${
                isSecondaryUser && currentUser?.id === u.id ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <div className="flex-1">
                <p className="text-sm font-medium">{u.nickname || u.user}</p>
                <p className="text-xs text-gray-500 truncate max-w-[180px]">{u.email}</p>
              </div>
              {isSecondaryUser && currentUser?.id === u.id && (
                <span className="text-xs">Ativa</span>
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
import React from 'react';
import { ChevronDown, User as UserIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();

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
          className="flex items-center gap-2 px-3 py-2 text-sm"
          disabled={isSwitchingUser || isLoadingUsers}
        >
          <UserIcon className="w-4 h-4" />
          <span className="max-w-32 truncate">
            {currentUser?.nickname || currentUser?.user || 'Carregando...'}
          </span>
          {isSecondaryUser && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Alternativa
            </span>
          )}
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-white border border-gray-200 shadow-lg">
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-sm font-medium text-gray-900">Alternar Conta</p>
          <p className="text-xs text-gray-500">
            Conta atual: {currentUser?.nickname || currentUser?.user}
          </p>
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
        ) : (
          usersData
            ?.filter((u: any) => u.id !== user.id)
            ?.map((u: any) => (
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
                  <p className="text-xs text-gray-500">{u.email}</p>
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
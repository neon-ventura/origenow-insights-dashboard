import React, { useState, useMemo } from 'react';
import { ChevronDown, User as UserIcon, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useUsers';
import { toast } from 'sonner';

export const AccountSelector = () => {
  const { user, currentUser, isSecondaryUser, isSwitchingUser, switchUser, switchBackToMainUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
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
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
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
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-left">Alternar Conta</DialogTitle>
          <p className="text-sm text-muted-foreground text-left">
            Conta atual: {currentUser?.nickname || currentUser?.user}
          </p>
        </DialogHeader>

        <div className="flex flex-col max-h-[60vh]">
          {/* Barra de pesquisa */}
          <div className="p-4 border-b">
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
          
          {/* Lista de contas - com scroll */}
          <div className="flex-1 overflow-y-auto">
            {/* Conta principal */}
            <button
              onClick={() => handleUserSwitch(user.id)}
              className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors ${
                !isSecondaryUser ? 'bg-blue-50 text-blue-700' : ''
              }`}
            >
              <UserIcon className="w-4 h-4 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.nickname || user.user}</p>
                <p className="text-xs text-gray-500">Conta Principal</p>
              </div>
              {!isSecondaryUser && <span className="text-xs shrink-0">Ativa</span>}
            </button>

            <div className="border-t mx-4" />

            {/* Outras contas */}
            {isLoadingUsers ? (
              <div className="px-4 py-3 text-sm text-gray-500">Carregando usuários...</div>
            ) : filteredUsers.length === 0 && searchTerm ? (
              <div className="px-4 py-3 text-sm text-gray-500">Nenhuma conta encontrada</div>
            ) : (
              filteredUsers.map((u: any) => (
                <button
                  key={u.id}
                  onClick={() => handleUserSwitch(u.id)}
                  className={`flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors ${
                    isSecondaryUser && currentUser?.id === u.id ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <UserIcon className="w-4 h-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.nickname || u.user}</p>
                    <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  </div>
                  {isSecondaryUser && currentUser?.id === u.id && (
                    <span className="text-xs shrink-0">Ativa</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
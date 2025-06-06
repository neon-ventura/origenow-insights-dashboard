
import React, { useState } from 'react';
import { Bell, HelpCircle, User, Search, ChevronDown } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectedUser {
  nickname: string;
  sellerId: string;
}

export const Header = () => {
  const { data: users = [], isLoading } = useUsers();
  const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);

  // Filtra apenas usuários com nickname válido
  const validUsers = users.filter(user => user.nickname && user.sellerId);

  const handleUserSelect = (value: string) => {
    const user = validUsers.find(u => u.nickname === value);
    if (user) {
      setSelectedUser({
        nickname: user.nickname!,
        sellerId: user.sellerId!,
      });
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Encontrar uma campanha"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
            <div className="text-right">
              <div className="min-w-[200px]">
                <Select onValueChange={handleUserSelect} disabled={isLoading}>
                  <SelectTrigger className="w-full border-none shadow-none p-0 h-auto bg-transparent">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {selectedUser?.nickname || 'Selecionar usuário'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {selectedUser?.sellerId || 'Nenhum usuário selecionado'}
                      </p>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {validUsers.map((user) => (
                      <SelectItem key={user.sellerId} value={user.nickname!}>
                        <div className="text-left">
                          <div className="font-medium">{user.nickname}</div>
                          <div className="text-xs text-gray-500">{user.sellerId}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

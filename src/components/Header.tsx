import React, { useState } from 'react';
import { Bell, MessageCircle, User, Search, ChevronDown, Download, X, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUsers } from '@/hooks/useUsers';
import { useUserContext } from '@/contexts/UserContext';
import { useJobs } from '@/contexts/JobContext';
import { ApiNotifications } from '@/components/ApiNotifications';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/useNotifications';

export const Header = () => {
  const {
    data: users = [],
    isLoading
  } = useUsers();
  const {
    selectedUser,
    setSelectedUser
  } = useUserContext();
  const {
    unreadCompletedJobs,
    markJobAsRead,
    removeJob
  } = useJobs();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userSelectorOpen, setUserSelectorOpen] = useState(false);

  // Buscar notificações da API
  const {
    data: apiNotifications = []
  } = useNotifications(selectedUser?.sellerId || null);

  // Filtra apenas usuários com dados válidos
  const validUsers = users.filter(user => user.user && user.nickname && user.sellerId);
  const handleUserSelect = (user: any) => {
    setSelectedUser({
      user: user.user,
      nickname: user.nickname,
      sellerId: user.sellerId
    });
    setUserSelectorOpen(false);
  };
  const getJobTypeName = (type: string): string => {
    switch (type) {
      case 'gtin':
        return 'Verificação de GTIN';
      case 'ofertas':
        return 'Publicar Ofertas';
      case 'estoque':
        return 'Atualização de Estoque';
      default:
        return 'Processo';
    }
  };
  const downloadFile = (downloadData: {
    file: string;
    filename: string;
  }) => {
    try {
      const byteCharacters = atob(downloadData.file);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({
        title: "Download realizado!",
        description: "A planilha foi baixada com sucesso."
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível fazer o download da planilha.",
        variant: "destructive"
      });
    }
  };

  // Calcular total de notificações (jobs + API)
  const totalNotifications = unreadCompletedJobs.length + apiNotifications.length;
  const handleNotificationClick = (jobId: string) => {
    markJobAsRead(jobId);
  };
  const handleRemoveNotification = (jobId: string) => {
    removeJob(jobId);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: "Seller ID copiado para a área de transferência.",
      });
    }).catch(() => {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o Seller ID.",
        variant: "destructive",
      });
    });
  };

  return <header className="bg-white border-b border-gray-200 px-6 py-4">
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
          <Link to="/suporte">
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </Link>
          
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                {totalNotifications > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-96 mr-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                  {totalNotifications > 0 && <Badge variant="secondary">{totalNotifications}</Badge>}
                </div>
                
                {/* Notificações da API Amazon */}
                <ApiNotifications sellerId={selectedUser?.sellerId || null} />
                
                {/* Separador se houver ambos os tipos */}
                {unreadCompletedJobs.length > 0 && apiNotifications.length > 0 && <div className="border-t pt-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-sm font-medium text-gray-900">Processamentos</span>
                      <Badge variant="secondary" className="text-xs">
                        {unreadCompletedJobs.length}
                      </Badge>
                    </div>
                  </div>}
                
                {/* Notificações de Jobs */}
                {unreadCompletedJobs.length === 0 && apiNotifications.length === 0 ? <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma notificação
                  </p> : unreadCompletedJobs.length > 0 ? <div className="space-y-2 max-h-96 overflow-y-auto">
                    {unreadCompletedJobs.map(job => <div key={job.id} className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {getJobTypeName(job.type)}
                              </h4>
                              <Badge variant={job.status === 'completed' ? 'default' : 'destructive'} className="text-xs">
                                {job.status === 'completed' ? 'Concluído' : 'Falhou'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Arquivo: {job.fileName}
                            </p>
                            {job.status === 'failed' && job.error && <p className="text-xs text-red-600 mt-1">
                                {job.error}
                              </p>}
                          </div>
                          <button onClick={() => handleRemoveNotification(job.id)} className="text-gray-400 hover:text-gray-600 ml-2">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {job.status === 'completed' && <div className="mt-3 flex space-x-2">
                            <Button size="sm" onClick={() => handleNotificationClick(job.id)} className="text-xs">
                              Marcar como lida
                            </Button>
                            {job.downloadData && <Button size="sm" variant="outline" onClick={() => downloadFile(job.downloadData!)} className="text-xs flex items-center space-x-1">
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </Button>}
                          </div>}
                      </div>)}
                  </div> : null}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
            <div className="text-right">
              <div className="min-w-[200px]">
                <Popover open={userSelectorOpen} onOpenChange={setUserSelectorOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" role="combobox" aria-expanded={userSelectorOpen} className="w-full justify-between border-none shadow-none p-0 h-auto bg-transparent hover:bg-transparent" disabled={isLoading}>
                      <div className="text-right">
                        {selectedUser ? (
                          <div className="flex items-center space-x-2">
                            <div>
                              <p className="text-xs text-gray-500">
                                {selectedUser.sellerId}
                              </p>
                              <p className="text-sm font-medium text-gray-900">
                                {selectedUser.user}
                              </p>
                              <p className="text-xs text-gray-600">
                                {selectedUser.nickname}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(selectedUser.sellerId);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Copy className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Selecionar usuário
                            </p>
                            <p className="text-xs text-gray-500">
                              Nenhum usuário selecionado
                            </p>
                          </div>
                        )}
                      </div>
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[320px] p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Pesquisar usuário..." />
                      <CommandList>
                        <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                        <CommandGroup>
                          {validUsers.map(user => 
                            <CommandItem 
                              key={user.sellerId} 
                              value={`${user.user} ${user.nickname} ${user.sellerId}`} 
                              onSelect={() => handleUserSelect(user)} 
                              className="cursor-pointer px-4 py-3"
                            >
                              <div className="text-left w-full">
                                <div className="text-xs text-gray-500 mb-1">{user.sellerId}</div>
                                <div className="font-medium text-base text-gray-900 mb-1">{user.user}</div>
                                <div className="text-sm text-gray-600">{user.nickname}</div>
                              </div>
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </header>;
};

import React, { useState } from 'react';
import { Bell, HelpCircle, User, Search, ChevronDown, Download, X } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useUserContext } from '@/contexts/UserContext';
import { useJobs } from '@/contexts/JobContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

export const Header = () => {
  const { data: users = [], isLoading } = useUsers();
  const { selectedUser, setSelectedUser } = useUserContext();
  const { unreadCompletedJobs, markJobAsRead, removeJob } = useJobs();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Filtra apenas usuários com nickname e sellerId válidos, e exclui Pedro
  const validUsers = users.filter(user => 
    user.nickname && 
    user.sellerId && 
    user.user.toUpperCase() !== 'PEDRO'
  );

  const handleUserSelect = (value: string) => {
    const user = validUsers.find(u => u.nickname === value);
    if (user) {
      setSelectedUser({
        user: user.user,
        nickname: user.nickname!,
        sellerId: user.sellerId!,
      });
    }
  };

  const getJobTypeName = (type: string): string => {
    switch (type) {
      case 'gtin': return 'Verificação de GTIN';
      case 'ofertas': return 'Publicar Ofertas';
      case 'estoque': return 'Atualização de Estoque';
      default: return 'Processo';
    }
  };

  const downloadFile = (downloadData: { file: string; filename: string }) => {
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
        description: "A planilha foi baixada com sucesso.",
      });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        title: "Erro no download",
        description: "Não foi possível fazer o download da planilha.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (jobId: string) => {
    markJobAsRead(jobId);
  };

  const handleRemoveNotification = (jobId: string) => {
    removeJob(jobId);
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
          
          <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <PopoverTrigger asChild>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                {unreadCompletedJobs.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 mr-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                  {unreadCompletedJobs.length > 0 && (
                    <Badge variant="secondary">{unreadCompletedJobs.length}</Badge>
                  )}
                </div>
                
                {unreadCompletedJobs.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma notificação
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {unreadCompletedJobs.map((job) => (
                      <div
                        key={job.id}
                        className="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="text-sm font-medium text-gray-900">
                                {getJobTypeName(job.type)}
                              </h4>
                              <Badge 
                                variant={job.status === 'completed' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {job.status === 'completed' ? 'Concluído' : 'Falhou'}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Arquivo: {job.fileName}
                            </p>
                            {job.status === 'failed' && job.error && (
                              <p className="text-xs text-red-600 mt-1">
                                {job.error}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveNotification(job.id)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {job.status === 'completed' && (
                          <div className="mt-3 flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleNotificationClick(job.id)}
                              className="text-xs"
                            >
                              Marcar como lida
                            </Button>
                            {job.downloadData && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadFile(job.downloadData!)}
                                className="text-xs flex items-center space-x-1"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
            <div className="text-right">
              <div className="min-w-[200px]">
                <Select onValueChange={handleUserSelect} disabled={isLoading} value={selectedUser?.nickname || ""}>
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

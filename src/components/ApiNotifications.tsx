import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, X, Calendar, DollarSign, Eye, Trash2 } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from '@/hooks/useNotifications';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';

interface ApiNotificationsProps {
  sellerId: string | null;
  onRemove?: (orderId: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Shipped': return 'bg-green-500';
    case 'Unshipped': return 'bg-yellow-500';
    case 'Canceled': return 'bg-red-500';
    case 'UpComing': return 'bg-blue-500';
    default: return 'bg-gray-500';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'Shipped': return 'Enviado';
    case 'Unshipped': return 'Não Enviado';
    case 'Canceled': return 'Cancelado';
    case 'UpComing': return 'Processando';
    default: return status;
  }
};

export const ApiNotifications = ({ sellerId, onRemove }: ApiNotificationsProps) => {
  const { data: notifications = [], isLoading, error } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();
  const [showReadNotifications, setShowReadNotifications] = React.useState(false);
  const { data: readNotifications = [], isLoading: isLoadingRead } = useNotifications(showReadNotifications ? 'lidas' : 'nao_lidas');

  const handleMarkAsRead = async (orderId: string) => {
    try {
      await markAsReadMutation.mutateAsync(orderId);
      toast({
        title: "Notificação marcada como lida",
        description: `Pedido ${orderId} foi marcado como visualizado.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar a notificação como lida.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (notifications.length === 0) return;
    
    try {
      const orderIds = notifications.map(notification => notification.orderId);
      await markAllAsReadMutation.mutateAsync(orderIds);
      toast({
        title: "Todas as notificações foram marcadas como lidas",
        description: `${notifications.length} notificações foram processadas com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível marcar todas as notificações como lidas.",
        variant: "destructive",
      });
    }
  };

  const handleToggleReadNotifications = () => {
    setShowReadNotifications(!showReadNotifications);
  };

  if (!sellerId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-3 text-center text-gray-500">
        <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-2"></div>
        <p className="text-xs">Carregando notificações...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-center text-red-500">
        <p className="text-xs">Erro ao carregar notificações</p>
      </div>
    );
  }

  if (notifications.length === 0 && (!showReadNotifications || readNotifications.length === 0)) {
    return (
      <div className="p-3 text-center text-gray-500">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">Nenhuma notificação</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="flex items-center space-x-2">
          <ShoppingBag className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-900">
            Pedidos Amazon
          </span>
          <Badge variant="secondary" className="text-xs">
            {notifications.length + (showReadNotifications ? readNotifications.length : 0)}
          </Badge>
        </div>
        
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
            title="Marcar todas como lidas"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-2 px-3">
        {/* Notificações não lidas */}
        {notifications.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 px-2 py-1 bg-blue-50 rounded">
              Não Lidas ({notifications.length})
            </div>
            {notifications.map((notification) => (
              <div
                key={notification.orderId}
                className="p-3 border rounded-lg transition-colors relative bg-blue-50 hover:bg-blue-100"
              >
                {/* X button in top right corner */}
                <button
                  onClick={() => handleMarkAsRead(notification.orderId)}
                  disabled={markAsReadMutation.isPending}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white/50 transition-colors"
                  title="Marcar como visualizada"
                >
                  <X className="w-4 h-4" />
                </button>
                
                <div className="flex items-start justify-between pr-8">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs text-white ${getStatusColor(notification.status)}`}
                      >
                        {getStatusText(notification.status)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        #{notification.orderId}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {notification.title}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Package className="w-3 h-3" />
                        <span>{notification.asin}</span>
                      </div>
                      
                      {notification.price && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>R$ {notification.price.Amount}</span>
                        </div>
                      )}
                    </div>
                    
                    {notification.purchaseDate && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Compra: {format(new Date(notification.purchaseDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {onRemove && (
                    <button
                      onClick={() => onRemove(notification.orderId)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Notificações lidas (se habilitadas) */}
        {showReadNotifications && readNotifications.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 px-2 py-1 bg-gray-50 rounded">
              Lidas ({readNotifications.length})
            </div>
            {readNotifications.map((notification) => (
              <div
                key={notification.orderId}
                className="p-3 border rounded-lg transition-colors relative bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        className={`text-xs text-white ${getStatusColor(notification.status)}`}
                      >
                        {getStatusText(notification.status)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        #{notification.orderId}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                      {notification.title}
                    </h4>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Package className="w-3 h-3" />
                        <span>{notification.asin}</span>
                      </div>
                      
                      {notification.price && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-3 h-3" />
                          <span>R$ {notification.price.Amount}</span>
                        </div>
                      )}
                    </div>
                    
                    {notification.purchaseDate && (
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                          Compra: {format(new Date(notification.purchaseDate), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {onRemove && (
                    <button
                      onClick={() => onRemove(notification.orderId)}
                      className="text-gray-400 hover:text-gray-600 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Botão para alternar notificações lidas */}
        {notifications.length > 0 && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleReadNotifications}
              disabled={isLoadingRead}
              className="w-full text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              {isLoadingRead 
                ? 'Carregando...' 
                : showReadNotifications 
                  ? 'Ocultar Notificações Lidas' 
                  : 'Ver Notificações Lidas'
              }
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Package, X, Calendar, DollarSign, Eye } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead } from '@/hooks/useNotifications';
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
  const { data: notifications = [], isLoading, error } = useNotifications(sellerId);
  const markAsReadMutation = useMarkNotificationAsRead(sellerId);
  const [showReadNotifications, setShowReadNotifications] = React.useState(false);
  const { data: readNotifications = [], isLoading: isLoadingRead } = useNotifications(sellerId, showReadNotifications ? 'lidas' : null);

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

  const handleViewReadNotifications = () => {
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

  const displayNotifications = showReadNotifications ? readNotifications : notifications;

  if (!showReadNotifications && notifications.length === 0) {
    return (
      <div className="p-3 text-center text-gray-500">
        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-xs">Nenhuma notificação não lida</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2 px-3 py-2 border-b">
        <ShoppingBag className="w-4 h-4 text-blue-500" />
        <span className="text-sm font-medium text-gray-900">
          {showReadNotifications ? 'Pedidos Lidos' : 'Pedidos Amazon'}
        </span>
        <Badge variant="secondary" className="text-xs">
          {displayNotifications.length}
        </Badge>
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-2 px-3">
        {displayNotifications.map((notification) => (
          <div
            key={notification.orderId}
            className={`p-3 border rounded-lg transition-colors relative ${
              showReadNotifications ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100'
            }`}
          >
            {/* X button in top right corner for unread notifications */}
            {!showReadNotifications && (
              <button
                onClick={() => handleMarkAsRead(notification.orderId)}
                disabled={markAsReadMutation.isPending}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-white/50 transition-colors"
                title="Marcar como visualizada"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
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
        
        {/* Button to toggle read notifications */}
        {!showReadNotifications && notifications.length > 0 && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewReadNotifications}
              disabled={isLoadingRead}
              className="w-full text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              {isLoadingRead ? 'Carregando...' : 'Ver Notificações Lidas'}
            </Button>
          </div>
        )}
        
        {/* Back button when showing read notifications */}
        {showReadNotifications && (
          <div className="pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewReadNotifications}
              className="w-full text-xs"
            >
              Voltar para Não Lidas
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

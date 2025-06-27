
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PedidoItem {
  asin: string;
  sku: string;
  titulo: string;
  preco_unitario: string;
  quantidade: string;
  link: string;
}

interface Pedido {
  id: string;
  status: string;
  link: string;
  items: PedidoItem[];
  frete: string;
  envio: string;
  valor_total: string;
  cidade: string;
  estado: string;
  nickname: string;
  data_compra: string;
}

interface PedidosTableProps {
  pedidos: Pedido[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'shipped':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'shipped':
      return 'Enviado';
    case 'cancelled':
      return 'Cancelado';
    case 'pending':
      return 'Pendente';
    default:
      return status;
  }
};

export const PedidosTable = ({ pedidos }: PedidosTableProps) => {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID do Pedido</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Valor Total</TableHead>
            <TableHead>Localização</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">
                {pedido.id}
              </TableCell>
              <TableCell>
                {formatDate(pedido.data_compra)}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(pedido.status)}>
                  {getStatusText(pedido.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {pedido.items.map((item, index) => (
                    <div key={index} className="text-sm">
                      <div className="font-medium truncate max-w-xs" title={item.titulo}>
                        {item.titulo}
                      </div>
                      <div className="text-gray-500">
                        Qtd: {item.quantidade} | {formatCurrency(item.preco_unitario)}
                      </div>
                    </div>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(pedido.valor_total)}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{pedido.cidade}</div>
                  <div className="text-gray-500">{pedido.estado}</div>
                </div>
              </TableCell>
              <TableCell>
                <a
                  href={pedido.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ver Pedido
                  <ExternalLink className="w-4 h-4" />
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

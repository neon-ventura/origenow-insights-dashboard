
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const products = [
  {
    sku: 'SKU-001-ABC',
    asin: 'B08N5WRWNW',
    titulo: 'Smartphone Samsung Galaxy A54 128GB Preto',
    status: 'Ativo',
    preco: 'R$ 1.299,90',
    estoque: 45,
    diasAtivos: 127,
    dataCriacao: '15/03/2024'
  },
  {
    sku: 'SKU-002-DEF',
    asin: 'B09G9FPHP1',
    titulo: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
    status: 'Ativo',
    preco: 'R$ 199,90',
    estoque: 23,
    diasAtivos: 89,
    dataCriacao: '22/03/2024'
  },
  {
    sku: 'SKU-003-GHI',
    asin: 'B07H8ZJJK3',
    titulo: 'Notebook Lenovo IdeaPad 3 Intel Core i5',
    status: 'Inativo',
    preco: 'R$ 2.499,00',
    estoque: 0,
    diasAtivos: 0,
    dataCriacao: '10/02/2024'
  },
  {
    sku: 'SKU-004-JKL',
    asin: 'B08KGWJVF2',
    titulo: 'Smart TV LG 43 Polegadas 4K UHD',
    status: 'Ativo',
    preco: 'R$ 1.899,90',
    estoque: 12,
    diasAtivos: 156,
    dataCriacao: '05/01/2024'
  },
  {
    sku: 'SKU-005-MNO',
    asin: 'B09JKFGH23',
    titulo: 'Cafeteira Elétrica Mondial Dolce Arome',
    status: 'Ativo',
    preco: 'R$ 89,90',
    estoque: 67,
    diasAtivos: 203,
    dataCriacao: '28/12/2023'
  }
];

export const ProductsTable = () => {
  const getStatusColor = (status: string) => {
    return status === 'Ativo' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header da Tabela */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Produtos Amazon</h2>
            <p className="text-sm text-gray-500">Gerencie todos os seus produtos listados na Amazon</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Exportar</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <span>Filtros</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">SKU</TableHead>
              <TableHead className="font-semibold text-gray-900">ASIN</TableHead>
              <TableHead className="font-semibold text-gray-900">Título</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Preço</TableHead>
              <TableHead className="font-semibold text-gray-900">Estoque</TableHead>
              <TableHead className="font-semibold text-gray-900">Dias Ativos</TableHead>
              <TableHead className="font-semibold text-gray-900">Data de Criação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm font-medium text-blue-600">
                  {product.sku}
                </TableCell>
                <TableCell className="font-mono text-sm text-gray-600">
                  {product.asin}
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {product.titulo}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    getStatusColor(product.status)
                  )}>
                    {product.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-semibold text-gray-900">
                  {product.preco}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {product.estoque}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {product.diasAtivos}
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {product.dataCriacao}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer da Tabela */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Mostrando 5 de 1.247 produtos</span>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded text-xs">1</span>
            <span className="px-3 py-1 hover:bg-gray-200 rounded text-xs cursor-pointer">2</span>
            <span className="px-3 py-1 hover:bg-gray-200 rounded text-xs cursor-pointer">3</span>
            <Button variant="outline" size="sm">
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

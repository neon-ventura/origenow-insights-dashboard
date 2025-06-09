
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, XCircle, BarChart3 } from 'lucide-react';

interface StockResult {
  sku: number;
  status: string;
  mensagem: string;
}

interface StockResponse {
  mensagem: string;
  resultados: StockResult[];
}

interface StockResultsProps {
  results: StockResponse;
}

export const StockResults = ({ results }: StockResultsProps) => {
  const successCount = results.resultados.filter(r => r.status === 'sucesso').length;
  const errorCount = results.resultados.filter(r => r.status === 'erro').length;
  const totalCount = results.resultados.length;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sucesso':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'erro':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sucesso':
        return 'text-green-800 bg-green-100 border-green-200';
      case 'erro':
        return 'text-red-800 bg-red-100 border-red-200';
      default:
        return 'text-yellow-800 bg-yellow-100 border-yellow-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <span>Resultados da Atualização</span>
        </CardTitle>
        <CardDescription>
          {results.mensagem}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Total</span>
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{totalCount}</p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Sucessos</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{successCount}</p>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-900">Erros</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-1">{errorCount}</p>
          </div>
        </div>

        {/* Lista de Resultados */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Detalhes por SKU:</h4>
          <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            {results.resultados.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-gray-900">SKU: {result.sku}</p>
                    <p className="text-sm text-gray-600">{result.mensagem}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                  {result.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Estatísticas */}
        {totalCount > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Estatísticas do Processamento:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Taxa de Sucesso:</span>
                <span className="font-medium text-green-600 ml-2">
                  {((successCount / totalCount) * 100).toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Taxa de Erro:</span>
                <span className="font-medium text-red-600 ml-2">
                  {((errorCount / totalCount) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

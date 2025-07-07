import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/endpoints';

export const StockTemplateDownload = () => {
  const handleDownloadTemplate = async () => {
    try {
      await apiClient.download(ENDPOINTS.TEMPLATES.PRICE_STOCK_UPDATE, 'template-atualizacao-estoque.xlsx');

      toast({
        title: "Template baixado com sucesso!",
        description: "O arquivo foi salvo em seus downloads.",
      });
    } catch (error) {
      console.error('Erro ao fazer download:', error);
      toast({
        title: "Erro ao baixar template",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {/* removida a cor verde */}
          <span>Modelo de Planilha para Atualização</span>
        </CardTitle>
        <CardDescription>
          Baixe o modelo oficial para estruturar as atualizações de preço e estoque
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* fundo branco e borda #EAEAEA */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#EAEAEA]">
          <div className="flex items-center space-x-3">
            {/* ícone dentro de container branco */}
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-[#0f172a]" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Template de Atualização de Estoque</h3>
              <p className="text-sm text-gray-500">Arquivo Excel (.xlsx)</p>
            </div>
          </div>
          <Button onClick={handleDownloadTemplate} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Baixar Modelo</span>
          </Button>
        </div>

        {/* instruções no padrão azul */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Instruções importantes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Preencha as colunas de SKU, preço e quantidade de estoque</li>
            <li>• Mantenha a formatação original do arquivo</li>
            <li>• <strong>Não altere os cabeçalhos das colunas</strong></li>
            <li>• Envie o arquivo no formato Excel (.xlsx)</li>
            <li>• <strong>Limite de 10.000 linhas e tamanho máximo de 25MB</strong></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

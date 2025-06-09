
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileSpreadsheet } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const StockTemplateDownload = () => {
  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/download-template-atualizacao');
      
      if (!response.ok) {
        throw new Error('Erro ao baixar o template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'template-atualizacao-estoque.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <span>Modelo de Planilha para Atualização</span>
        </CardTitle>
        <CardDescription>
          Baixe o modelo oficial para estruturar as atualizações de preço e estoque
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
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
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Instruções importantes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Preencha as colunas de SKU, preço e quantidade de estoque</li>
            <li>• Mantenha a formatação original do arquivo</li>
            <li>• Não altere os cabeçalhos das colunas</li>
            <li>• Salve o arquivo no formato Excel (.xlsx)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

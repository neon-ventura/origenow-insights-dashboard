
import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/endpoints';

export const DeleteTemplateDownload = () => {
  const handleDownload = async () => {
    try {
      await apiClient.download(ENDPOINTS.DELETE.TEMPLATE, 'template-deletar-ofertas.xlsx');

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
          <span>Template para Deletar Ofertas</span>
        </CardTitle>
        <CardDescription>
          Baixe o modelo de planilha para deletar ofertas na Amazon
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Seção principal: fundo branco e borda #EAEAEA */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#EAEAEA]">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#0f172a]" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Template Deletar Ofertas</p>
              <p className="text-sm text-gray-500">Arquivo Excel (.xlsx)</p>
            </div>
          </div>
          <Button onClick={handleDownload} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Baixar Template</span>
          </Button>
        </div>

        {/* Instruções: padrão azul como nos outros templates */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Instruções importantes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Preencha apenas os campos obrigatórios destacados no template</li>
            <li>• Certifique-se de que os SKUs estão corretos antes de enviar</li>
            <li>• Esta ação não pode ser desfeita após o processamento</li>
            <li>• Verifique se as ofertas realmente devem ser deletadas</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

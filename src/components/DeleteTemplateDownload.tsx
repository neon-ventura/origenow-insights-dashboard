
import React from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export const DeleteTemplateDownload = () => {
  const handleDownload = () => {
    toast({
      title: "Download iniciado",
      description: "O template para deletar ofertas será baixado em breve.",
    });
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
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-red-600" />
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
        
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Instruções importantes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
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


import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export const UploadLimitsAlert = () => {
  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Limites de upload:</strong> Máximo de 10.000 linhas e tamanho de arquivo até 25MB.
      </AlertDescription>
    </Alert>
  );
};

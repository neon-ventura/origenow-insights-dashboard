
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const EmailVerificationAlert = () => {
  const { isEmailVerified, isAuthenticated } = useAuth();

  if (!isAuthenticated || isEmailVerified) {
    return null;
  }

  return (
    <Alert className="bg-red-50 border-red-200 text-red-800 mb-4">
      <AlertTriangle className="h-4 w-4 text-red-600" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>Atenção:</strong> Seu e-mail ainda não foi verificado. 
          Por favor, verifique sua caixa de entrada e confirme seu e-mail para ter acesso completo às funcionalidades.
        </span>
      </AlertDescription>
    </Alert>
  );
};

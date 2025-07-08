import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AmazonAuthGuardProps {
  children: React.ReactNode;
}

export const AmazonAuthGuard: React.FC<AmazonAuthGuardProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  // Se não estiver autenticado, deixa o ProtectedRoute lidar com isso
  if (!isAuthenticated || !user) {
    return <>{children}</>;
  }

  // Se o usuário não tem autorização Amazon, redireciona para a tela de autorização
  if (!user.amazon_autorizado) {
    return <Navigate to="/autorizacao-amazon" replace />;
  }

  // Se tem autorização, mostra o conteúdo normalmente
  return <>{children}</>;
};
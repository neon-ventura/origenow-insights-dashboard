import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface AmazonAuthGuardProps {
  children: React.ReactNode;
}

export const AmazonAuthGuard: React.FC<AmazonAuthGuardProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();

  // Se não estiver autenticado, deixa o ProtectedRoute lidar com isso
  if (!isAuthenticated || !currentUser) {
    return <>{children}</>;
  }

  // Se o usuário não tem sellerId ou nickname, redireciona para a tela de autorização
  if (!currentUser.sellerId || !currentUser.nickname) {
    return <Navigate to="/autorizacao-amazon" replace />;
  }

  // Se tem autorização, mostra o conteúdo normalmente
  return <>{children}</>;
};
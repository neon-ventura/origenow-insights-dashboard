
import React, { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Simular usuário sempre autenticado
  const isAuthenticated = true;
  const adminUser = "Usuário Admin";

  const login = (email: string, password: string): boolean => {
    // Sempre retorna true para simular login automático
    return true;
  };

  const logout = () => {
    // Função vazia para manter compatibilidade
    console.log('Logout simulado');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

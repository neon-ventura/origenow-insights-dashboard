
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  // Verificar se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setAdminUser(user.user || user.email);
        console.log('Usuário autenticado encontrado:', user.user || user.email);
      } catch (error) {
        console.error('Erro ao recuperar dados do usuário:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    console.log('Processando login local...');
    
    // Como a autenticação real já foi feita na API, apenas confirmar o estado
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setAdminUser(user.user || user.email);
        console.log('Login local bem-sucedido:', user.user || user.email);
        return true;
      } catch (error) {
        console.error('Erro no login local:', error);
        return false;
      }
    }
    
    return false;
  };

  const logout = () => {
    console.log('Logout realizado');
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('userData');
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

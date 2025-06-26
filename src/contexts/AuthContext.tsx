
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  adminUser: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  const login = (username: string, password: string): boolean => {
    console.log('Tentativa de login:', { username, password });
    
    // Credenciais do admin
    if (username === 'guilherme' && password === 'V@7k#r$w2!Bz^fQ') {
      console.log('Login bem-sucedido para admin:', username);
      setIsAuthenticated(true);
      setAdminUser(username);
      return true;
    }
    
    console.log('Falha no login - credenciais inválidas');
    return false;
  };

  const logout = () => {
    console.log('Logout realizado');
    setIsAuthenticated(false);
    setAdminUser(null);
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

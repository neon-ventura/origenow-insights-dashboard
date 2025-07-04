
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  user: string;
  email: string;
  sellerId: string;
  nickname: string;
  email_verificado: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  // Verificar se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const expiresAt = localStorage.getItem('tokenExpiration');
    const userData = localStorage.getItem('userData');
    
    if (token && expiresAt && userData) {
      const now = Date.now();
      const expiration = parseInt(expiresAt);
      
      if (now < expiration) {
        try {
          const userInfo = JSON.parse(userData);
          setUser(userInfo);
          setIsAuthenticated(true);
          setIsEmailVerified(userInfo.email_verificado === 'Verificado');
          console.log('Usuário autenticado encontrado:', userInfo.user);
        } catch (error) {
          console.error('Erro ao recuperar dados do usuário:', error);
          clearAuthData();
        }
      } else {
        console.log('Token expirado, removendo dados de autenticação');
        clearAuthData();
      }
    }
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    setIsEmailVerified(true);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Iniciando processo de login...');
    
    try {
      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Resposta do login:', data);

      if (data.status === 'success') {
        // Calcular tempo de expiração
        const expirationTime = Date.now() + (data.expires_in * 1000);
        
        // Armazenar dados no localStorage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('tokenExpiration', expirationTime.toString());
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        // Atualizar estado
        setUser(data.user);
        setIsAuthenticated(true);
        setIsEmailVerified(data.user.email_verificado === 'Verificado');
        
        console.log('Login bem-sucedido:', data.user.user);
        return true;
      } else {
        console.log('Falha no login:', data.message);
        return false;
      }
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logout realizado');
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      isEmailVerified, 
      login, 
      logout 
    }}>
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

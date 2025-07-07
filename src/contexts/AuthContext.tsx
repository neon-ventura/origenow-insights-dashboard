
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';

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
  currentUser: User | null;
  isSecondaryUser: boolean;
  isSwitchingUser: boolean;
  login: (email: string, password: string, secondaryUserId?: number) => Promise<boolean>;
  switchUser: (userId: number) => Promise<boolean>;
  switchBackToMainUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Usuário principal (ID 1)
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Usuário atualmente ativo
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isSecondaryUser, setIsSecondaryUser] = useState(false);
  const [isSwitchingUser, setIsSwitchingUser] = useState(false);

  // Efeito para fazer reload da página após trocar de usuário
  useEffect(() => {
    if (isSwitchingUser) {
      const timer = setTimeout(() => {
        window.location.reload();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isSwitchingUser]);

  // Verificar se há token salvo no localStorage ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const expiresAt = localStorage.getItem('tokenExpiration');
    const userData = localStorage.getItem('userData');
    const secondaryToken = localStorage.getItem('secondaryAuthToken');
    const secondaryUserData = localStorage.getItem('secondaryUserData');
    
    if (token && expiresAt && userData) {
      const now = Date.now();
      const expiration = parseInt(expiresAt);
      
      if (now < expiration) {
        try {
          const userInfo = JSON.parse(userData);
          setUser(userInfo);
          setIsAuthenticated(true);
          setIsEmailVerified(userInfo.email_verificado === 'Verificado');
          
          // Verificar se há usuário secundário ativo
          if (secondaryToken && secondaryUserData) {
            const secondaryInfo = JSON.parse(secondaryUserData);
            setCurrentUser(secondaryInfo);
            setIsSecondaryUser(true);
          } else {
            setCurrentUser(userInfo);
            setIsSecondaryUser(false);
          }
          
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
    localStorage.removeItem('secondaryAuthToken');
    localStorage.removeItem('secondaryUserData');
    setUser(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    setIsEmailVerified(true);
    setIsSecondaryUser(false);
  };

  const login = async (email: string, password: string, secondaryUserId?: number): Promise<boolean> => {
    console.log('Iniciando processo de login...');
    
    try {
      const mainToken = localStorage.getItem('authToken');
      const requestBody: any = {
        email: email,
        password: password,
      };

      // Se for login secundário, incluir secondary_user_id
      if (secondaryUserId) {
        requestBody.secondary_user_id = secondaryUserId;
      }

      const headers: any = {
        'Content-Type': 'application/json',
      };

      // Se for login secundário, incluir o token principal
      if (secondaryUserId && mainToken) {
        headers['Authorization'] = `Bearer ${mainToken}`;
      }

      const response = await fetch('https://dev.huntdigital.com.br/projeto-amazon/login', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Resposta do login:', data);

      if (data.status === 'success') {
        const expirationTime = Date.now() + (data.expires_in * 1000);
        
        if (secondaryUserId) {
          // Login secundário - armazenar como token secundário
          localStorage.setItem('secondaryAuthToken', data.token);
          localStorage.setItem('secondaryUserData', JSON.stringify(data.user));
          setCurrentUser(data.user);
          setIsSecondaryUser(true);
        } else {
          // Login principal
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('tokenExpiration', expirationTime.toString());
          localStorage.setItem('userData', JSON.stringify(data.user));
          setUser(data.user);
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          setIsEmailVerified(data.user.email_verificado === 'Verificado');
          setIsSecondaryUser(false);
        }
        
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

  const switchUser = async (userId: number): Promise<boolean> => {
    if (!user || user.id !== 1) {
      console.error('Apenas o usuário ID 1 pode trocar de conta');
      return false;
    }

    const mainToken = localStorage.getItem('authToken');
    if (!mainToken) {
      console.error('Token principal não encontrado');
      return false;
    }

    setIsSwitchingUser(true);
    const result = await login(user.email, '', userId);
    
    if (!result) {
      setIsSwitchingUser(false);
    }
    
    return result;
  };

  const switchBackToMainUser = () => {
    setIsSwitchingUser(true);
    localStorage.removeItem('secondaryAuthToken');
    localStorage.removeItem('secondaryUserData');
    setCurrentUser(user);
    setIsSecondaryUser(false);
  };

  const logout = () => {
    console.log('Logout realizado');
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      currentUser,
      isSecondaryUser,
      isSwitchingUser,
      isEmailVerified, 
      login, 
      switchUser,
      switchBackToMainUser,
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

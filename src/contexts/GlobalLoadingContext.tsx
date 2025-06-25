
import React, { createContext, useContext, useState } from 'react';

interface GlobalLoadingContextType {
  isLoading: boolean;
  title: string;
  description?: string;
  showLoading: (title: string, description?: string) => void;
  hideLoading: () => void;
}

const GlobalLoadingContext = createContext<GlobalLoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within a GlobalLoadingProvider');
  }
  return context;
};

export const GlobalLoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState<string | undefined>();

  const showLoading = (newTitle: string, newDescription?: string) => {
    setTitle(newTitle);
    setDescription(newDescription);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setTitle('');
    setDescription(undefined);
  };

  const value: GlobalLoadingContextType = {
    isLoading,
    title,
    description,
    showLoading,
    hideLoading,
  };

  return (
    <GlobalLoadingContext.Provider value={value}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};
